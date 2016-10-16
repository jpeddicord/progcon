.PHONY: noop dev

noop:
	@echo "this Makefile is for development only"

dev:
	rm -f ~/.cargo/bin/contest-exec
	cargo install
	sudo chown root:root ~/.cargo/bin/contest-exec
	sudo chmod 4755 ~/.cargo/bin/contest-exec
