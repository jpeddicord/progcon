FROM node:6-alpine
CMD ["node"]

COPY build /opt/progcon
RUN chmod 4755 /opt/progcon/bin/contest-exec

USER 1000
