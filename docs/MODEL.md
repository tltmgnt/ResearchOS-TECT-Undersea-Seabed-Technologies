# Acoustic network model and research limits
## Declared units and equations
Nodes have local Cartesian x/y in km and depth in metres, positive downward. A uniform flat seabed bounds depth. Euclidean range includes depth converted to km. Separation must be at least 1 m.
Declared transmission loss TL = 20 log10(range_m / 1 m) + absorptionDbKm × range_km.
Directed link margin = sourceLevelDb − TL − noiseDb − requiredSnrDb.
A link is feasible if margin >= 0. One-way propagation time = range_m / declared soundSpeedMps.

sourceLevelDb is an acoustic pressure level referenced to 1 µPa at 1 m; noiseDb is receiver noise integrated over the same declared receiver bandwidth, referenced to 1 µPa. These must be consistent owner inputs. No frequency-to-absorption or spectral-density conversion is provided. Receiver bandwidth, directivity, processing gain and modem performance are not inferred. Numbers in the fixture are fictional, not equipment ratings or field conditions.

## Scenario and graph semantics
Lower noise and upper noise use all nodes; upper noise + outage removes declared node IDs. These are assumption bounds, not statistical confidence intervals. Links can be asymmetric. Reverse BFS from the gateway identifies directed paths toward it and counts minimum hops. Every active node can relay; role labels do not restrict relay capability. Monitoring count includes sensors and vehicles, including disabled ones, for a fixed comparison denominator. No monitoring nodes means a count of 0/0, not a service percentage.

The gateway is reachable from itself with zero hops if active. Disabled and disconnected nodes have null hops. Propagation time is per link only; no end-to-end latency claim is made. Capacity, scheduling, collisions, retransmissions, energy, packet error rate and route stability are not modeled.

## Scope
No bathymetry, refraction, sound-speed profile, surface/bottom interactions, multipath, Doppler, environmental noise prediction, sensing/detection model, localization, vehicle motion, autonomous policy, hardware control or live transmissions are implemented. The monitoring network is a research foundation, not a validated undersea communications system.

## Evidence and validation roadmap
Source and review fields are unverified owner declarations. Preserve raw evidence separately. JSON is the reproducible input; CSV/Markdown are summaries. Browser storage belongs to one origin.
Validate units and receiver bandwidth; independently check ranges and losses; compare against authorized tank/field measurements; add environmental propagation and modem models; then evaluate routing and autonomous behavior in a separate validated simulator. Browser accessibility, mobile and import/export checks remain outstanding.
No DARPA affiliation, endorsement, operational approval or research novelty is claimed.
