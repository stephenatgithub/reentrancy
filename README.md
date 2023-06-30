## Vulnerability

A state has not been updated before an external call is made.

Another contract is reading this inaccurate outdated state.

It is exploited beause of this outdated state.


## Preventative Techniques

- Ensure all state changes happen before calling external contracts

- Use function modifiers that prevent re-entrancy


## Different Types of Reentrancy

- Classic reentrancy
- Cross-function reentrancy
- Cross-contract reentrancy
- Read-only reentrancy


## Read-only reentrancy

1. Attack contract calls function in Vulnerable contract
2. Vulnerable contract calls fallback in Attack contract
3. Attack contract calls function in Target contract
4. Target contract reads incorrect outdated value from Vulnerable contract 
5. Vulnerable contract is exploited by using incorrect outdated value



