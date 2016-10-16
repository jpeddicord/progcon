.PHONY: all bot contest-exec web install

DESTDIR=/opt/progcon

all: bot contest-exec web

bot:
	cd bot && cargo build --release

contest-exec:
	cd bot/contest-exec && cargo build --release

web:
	cd web && npm run release
	cd web/build && npm install --production

install:
	install -d $(DESTDIR)/bin $(DESTDIR)/conf $(DESTDIR)/web
	# web runtime
	rsync -rv web/build/ $(DESTDIR)/web
	install -T web/bin/run-server.js $(DESTDIR)/bin/progcon-server
	# bot
	install bot/target/release/progcon-bot $(DESTDIR)/bin
	install -m 4755 -o root -g root bot/contest-exec/target/release/contest-exec $(DESTDIR)/bin
	# configuration
	[ -e $(DESTDIR)/conf/config.js ] || cp $(DESTDIR)/web/server/config.template.js $(DESTDIR)/conf/config.js
	ln -sf $(DESTDIR)/conf/config.js $(DESTDIR)/web/server/config.js
