var memory_limit,
    already_called = false,
    execution_timeout,
    valid_options_list = 
    [
        'memory_limit',
        'execution_timeout',
        'infinite_loop_timeout',
        'memory_limit_callback',
        'execution_timeout_callback',
        'memory_limit_check_interval',
    ],
    infinite_loop_timeout,
    memory_limit_callback,
    execution_timeout_callback,
    memory_limit_check_interval

var is_valid_number_or_null = function(execution_timeout)
{
    return (
        execution_timeout == null 
        || (
            typeof execution_timeout === "number"
            && !isNaN(execution_timeout)
            && isFinite(execution_timeout)
        )
    )
}

var is_valid_callback_or_null = function(callback)
    { return callback == null || typeof callback === "function" }

module.exports = function(options)
{
    if(options == null)
        { throw new Error("Script limitations are not defined.") }
    if(already_called)
        { throw new Error("Script limitations already defined.") }
    if(!is_valid_number_or_null(options.memory_limit))
        { throw new Error("Memory limit must be a number.") }
    if(!is_valid_number_or_null(options.memory_limit_check_interval))
        { throw new Error("Memory limit check inteval must be a number.") }
    if(!is_valid_number_or_null(options.execution_timeout))
        { throw new Error("Execution timeout must be a number.") }
    if(!is_valid_callback_or_null(options.execution_timeout_callback))
        { throw new Error("Execution timeout callback must be a function.") }
    if(!is_valid_number_or_null(options.infinite_loop_timeout))
        { throw new Error("Infinite loop timeout must be a number.") }
    if(options.execution_timeout == null && options.execution_timeout_callback != null)
        { throw new Error("Execution timeout must be defined due to presence of execution timeout callback.") }
    for(key in options)
    {
        if(valid_options_list.indexOf(key) === -1)
            { throw new Error("Script limit option `" + key + "` is not allowed. Possible options are: " + valid_options_list.toString()) }
    }

    already_called = true

    // Execution timeout.
    execution_timeout = options.execution_timeout
    execution_timeout_callback = options.execution_timeout_callback
    if(execution_timeout_callback == null)
    {
        execution_timeout_callback = function()
        {
            console.error("Application stopped due to exceeding the execution_timeout (" + execution_timeout + " ms).")
            process.exit()
        }
    }
    if(execution_timeout != null)
    {
        setTimeout(execution_timeout_callback, execution_timeout).unref()
    }

    // Memory limit.
    memory_limit = options.memory_limit
    memory_limit_callback = options.memory_limit_callback
    if(memory_limit_callback == null)
    {
        memory_limit_callback = function()
        {
            console.error("Application stopped due to exceeding the memory_limit (" + memory_limit + " bytes).")
            process.exit()
        }
    }
    if(memory_limit_check_interval == null)
        { memory_limit_check_interval = 500 }
    if(memory_limit != null)
    {
        setInterval(
            function()
            {
                if(process.memoryUsage().rss > memory_limit)
                    { memory_limit_callback() }
            }, 
            memory_limit_check_interval
        ).unref()
    }

    // Infinite loop timeout.
    infinite_loop_timeout = options.infinite_loop_timeout
    if(infinite_loop_timeout != null)
    {
        require('tripwire').resetTripwire(infinite_loop_timeout)
    }

}