# script-limits
Allows to impose limits on a script in a runtime.

## Installation and Usage

```bash
npm install script-limits
```

```coffeescript
script_limits = require "script-limits"

script_limits
  memory_limit: 100*1024*1024
  execution_timeout: 30*(60*1000)
  infinite_loop_timeout: 2000
```

## Dependencies
- [`tripwire`](https://github.com/tjanczuk/tripwire)