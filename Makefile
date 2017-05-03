.PHONY: all bot contest-exec web install-base install docker

DESTDIR=/opt/progcon

all: bot contest-exec web

bot:
	cd bot && cargo build --release --target=x86_64-unknown-linux-musl

contest-exec:
	cd bot/contest-exec && cargo build --release --target=x86_64-unknown-linux-musl

web:
	cd web && npm run release
	cd web/build && npm install --production

install-base:
	install -d $(DESTDIR)/bin $(DESTDIR)/conf $(DESTDIR)/web
	# web runtime
	rsync -rv web/build/ $(DESTDIR)/web
	install -T web/bin/run-server.js $(DESTDIR)/bin/progcon-server
	# bot
	install bot/target/x86_64-unknown-linux-musl/release/progcon-bot $(DESTDIR)/bin
	install -m 0755 bot/contest-exec/target/x86_64-unknown-linux-musl/release/contest-exec $(DESTDIR)/bin
	# configuration
	[ -e $(DESTDIR)/conf/config.js ] || cp $(DESTDIR)/web/server/config.template.js $(DESTDIR)/conf/config.js
	ln -sf $(DESTDIR)/conf/config.js $(DESTDIR)/web/server/config.js

install: install-base
	chown root:root $(DESTDIR)/bin/contest-exec
	chmod 4755 $(DESTDIR)/bin/contest-exec

docker:
	$(MAKE) DESTDIR=$(shell pwd)/docker/build install-base
	cd docker && sudo docker build -t progcon .
