progcon
=======

progcon is an application that can help you run programming contests. It's designed for live,
in-person events where interested attendees can sign up and participate on the spot. It's
not designed for remote participation, though you could certainly try that if you prefer.

Installation
============

**NOTE:** The docker image is still fairly new, and some parts may be broken. But, it's about
100 times easier to use than installing it all yourself, so... give it a try.

Docker
------

I highly recommend using the docker image
[jpeddicord/progcon](https://hub.docker.com/r/jpeddicord/progcon/),
as everything is already built and ready-to-go. You'll need to supply your own configuration
and storage volumes, but a `docker-compose` file is available in the `docker` directory to
help you get started with that.

Building
--------

### Requirements

* NodeJS ^7.6
* nanomsg ^1.0
* Rust ^1.17 & Cargo
* Docker (optional)

### Building

After you've installed the above dependencies, go ahead and run `make` in the main directory.
This will compile the NodeJS application as well as the two Rust applications. If anything
fails here, double-check your dependencies.

Then, run `make install` as root (optionally setting DESTDIR, which defaults to `/opt/progcon`).
A successful installation actually does need to be run as root, as `contest-exec` needs to be
marked `setuid` in order to sandbox problem runners.

If that all succeeded, you should have `/opt/progcon/bin` with some nice executables,
`/opt/progcon/conf` for configuration, and `/opt/progcon/web` with website internals.

Configuration
-------------

The contest website can be configured with `config.js` in the `web/server` directory. You'll note
that this doesn't exist -- you can copy it from [`config.template.js`](web/server/config.template.js)
to get started.
For an installed copy, you should edit `/opt/progcon/conf/config.js`.

If any configuration needs to be loaded asynchronously, such as pulling credentials from
a remote server, you can delay application initialization by returning a promise in the `load`
function in this file.

This configuration file also controls how the grading robots will spawn. Be sure to have
enough to meet the demands of your contest! I recommend spawning one per core, minus one
to leave breathing room for the Node app. The grading robots are not currently multithreaded.

Operating
=========

TODO still, sorrrryyy

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
enough to figure out for writing your own problems.

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

Copyright (c) 2016 - 2017 Jacob Peddicord

progcon is released under the terms of the Mozilla Public License, version 2.0.
See the [LICENSE](LICENSE) for more information.

Sample problems (under the `sample-problems` directory) are available under CC0.
See [that file](sample-problems/LICENSE) for further details.
