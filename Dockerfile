FROM node:6-alpine
CMD ["/opt/progcon/bin/progcon-server"]

VOLUME /opt/progcon/conf /opt/progcon-problems /opt/progcon/logs

COPY build /opt/progcon
RUN chmod 4755 /opt/progcon/bin/contest-exec

USER 1000
