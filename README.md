# script-limits
Allows to impose limits on a script in a runtime.

## Installation and Usage

```bash
npm install script-limits
```

```coffeescript
script_limits = require "script-limits"

script_limits
  memory_limit: 100*1000*1000
  execution_timeout: 10*(60*60*1000)
  infinite_loop_timeout: 2000
```

## Dependencies
- [`tripwire`](github.com/tjanczuk/tripwire)