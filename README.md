## Vulnerability

For example contract A calls contract B.

Reentracy exploit allows B to call back into A before A finishes execution.

## Preventative Techniques

- Ensure all state changes happen before calling external contracts

- Use function modifiers that prevent re-entrancy


