progcon
=======

progcon is an application that can help you run programming contests. It's designed for live,
in-person events where interested attendees can sign up and participate on the spot. It's
not designed for remote participation, though you could certainly try that if you prefer.

Installation
============

Put a big ol' **TODO** stamp here, because this needs to be written. Sorry!

Requirements
------------

* NodeJS 5.x+ (possibly lower)
* nanomsg 0.5+ -- used for bot IPC
* Rust 1.9.0+ & Cargo

Configuration
-------------

The contest website can be configured with `config.js` in the `web/server` directory. You'll note
that this doesn't exist -- you can copy it from [`config.template.js`](web/server/config.template.js).

If any configuration needs to be loaded asynchronously, such as pulling credentials from
a remote server, you can delay application initialization by returning a promise in the `load`
function in this file.

This configuration file also controls how the grading robots will spawn. Be sure to have
enough to meet the demands of your contest!

Operating
=========

Creating a contest
------------------

Running the contest
-------------------

Ending the contest
------------------

FAQ
===

Where are the problems?
-----------------------

Not here. If I posted them online then people could just cheat, you see.

How do I write my own problem?
------------------------------

There is a sample problem (Fibonacci) in the sample-problems directory. The format is easy
to figure out for writing your own problems.

**TODO** again; more needs to be written on this

There sure are a lot of TODOs and XXXs in the source.
-----------------------------------------------------

Yup. Workin' on it.

Can I submit a pull request?
----------------------------

Hold off for now -- I'm changing a ton of stuff at the moment and I don't want your
contribution to be lost in the fray. That said, feel free to file issues for bugs you
find or features you're passionate about.

License
=======

Copyright (c) 2016 Jacob Peddicord

progcon is released under the terms of the Mozilla Public License, version 2.0.
See the [LICENSE](LICENSE) for more information.

Sample problems (under the `sample-problems` directory) are available under CC0.
See [that file](sample-problems/LICENSE) for further details.
