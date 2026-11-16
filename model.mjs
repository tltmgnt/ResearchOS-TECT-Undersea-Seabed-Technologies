export function validate(s){
 if(!s||s.version!==1||typeof s.name!=='string'||!s.name.trim())throw Error('Name and version 1 required.');
 for(const k of ['source','review'])if(typeof s[k]!=='string')throw Error(k+' must be text.');
 for(const [k,lo,hi]of [['soundSpeedMps',1300,1700],['absorptionDbKm',0,100],['noiseLowDb',0,200],['noiseHighDb',0,200],['requiredSnrDb',-30,100],['seabedDepthM',1,11000]])
 if(typeof s[k]!=='number'||!Number.isFinite(s[k])||s[k]<lo||s[k]>hi)throw Error(k+' must be '+lo+'–'+hi);
 if(s.noiseLowDb>s.noiseHighDb)throw Error('Noise bounds are reversed.');
 if(!Array.isArray(s.nodes)||!s.nodes.length||s.nodes.length>100)throw Error('Use 1–100 nodes.');
 const ids=new Set();
 for(const p of s.nodes){
  if(typeof p.id!=='string'||!p.id.trim()||ids.has(p.id))throw Error('Unique nonempty node IDs required.');ids.add(p.id);
  if(!['gateway','relay','sensor','vehicle'].includes(p.role))throw Error('Invalid node role.');
  for(const [k,lo,hi]of [['xKm',-1000,1000],['yKm',-1000,1000],['depthM',0,s.seabedDepthM],['sourceLevelDb',0,250]])
   if(typeof p[k]!=='number'||!Number.isFinite(p[k])||p[k]<lo||p[k]>hi)throw Error('Invalid '+k+' for '+p.id);
 }
 if(!s.nodes.some(p=>p.id===s.gateway&&p.role==='gateway'))throw Error('Select a gateway-role node.');
 if(!Array.isArray(s.disabled)||new Set(s.disabled).size!==s.disabled.length||s.disabled.some(id=>!ids.has(id)))throw Error('Disabled IDs must be unique existing nodes.');
 for(let i=0;i<s.nodes.length;i++)for(let j=i+1;j<s.nodes.length;j++)if(distance(s.nodes[i],s.nodes[j])<.001)throw Error('Node separation must be at least 1 m.');
 return s;
}
export function distance(a,b){return Math.hypot(a.xKm-b.xKm,a.yKm-b.yKm,(a.depthM-b.depthM)/1000);}
export function link(a,b,s,noiseDb){
 const rangeKm=distance(a,b);if(rangeKm<.001)throw Error('Range must be at least 1 m.');
 const lossDb=20*Math.log10(rangeKm*1000)+s.absorptionDbKm*rangeKm;
 const marginDb=a.sourceLevelDb-lossDb-noiseDb-s.requiredSnrDb;
 return {from:a.id,to:b.id,rangeKm,lossDb,marginDb,propagationSeconds:rangeKm*1000/s.soundSpeedMps,feasible:marginDb>=0};
}
function scenario(s,noiseDb,disabled,label){
 const active=s.nodes.filter(p=>!disabled.includes(p.id)),links=[];
 for(const a of active)for(const b of active)if(a!==b)links.push(link(a,b,s,noiseDb));
 const hops=new Map();if(active.some(p=>p.id===s.gateway))hops.set(s.gateway,0);
 const queue=[...hops.keys()];
 for(let i=0;i<queue.length;i++)for(const edge of links)if(edge.feasible&&edge.to===queue[i]&&!hops.has(edge.from)){hops.set(edge.from,hops.get(edge.to)+1);queue.push(edge.from);}
 const nodes=s.nodes.map(p=>({id:p.id,role:p.role,active:!disabled.includes(p.id),gatewayReachable:hops.has(p.id),hops:hops.get(p.id)??null}));
 const monitoring=nodes.filter(p=>p.role==='sensor'||p.role==='vehicle');
 return {scenario:label,noiseDb,activeNodes:active.length,feasibleLinks:links.filter(p=>p.feasible).length,reachableMonitoring:monitoring.filter(p=>p.gatewayReachable).length,monitoringCount:monitoring.length,nodes,links};
}
export function evaluate(s){validate(s);return [scenario(s,s.noiseLowDb,[],'Lower noise'),scenario(s,s.noiseHighDb,[],'Upper noise'),scenario(s,s.noiseHighDb,s.disabled,'Upper noise + outage')];}
export function csv(rows){
 const q=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
 return [['scenario','node','role','active','gatewayReachable','hops'],...rows.flatMap(r=>r.nodes.map(p=>[r.scenario,p.id,p.role,p.active,p.gatewayReachable,p.hops]))].map(r=>r.map(q).join(',')).join('\r\n');
}
