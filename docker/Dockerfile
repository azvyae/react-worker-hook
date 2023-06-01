FROM node:latest

ARG PASSWORD

USER root
RUN apt-get update && apt-get install -y sudo
RUN echo 'node:${PASSWORD}' | chpasswd
RUN usermod -aG sudo node

USER node
WORKDIR /home/node/app
RUN echo 'PS1="\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\\$ "' >> ~/.bashrc
EXPOSE 3000

CMD ["node"]
