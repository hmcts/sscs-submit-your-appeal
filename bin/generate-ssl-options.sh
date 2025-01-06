#!/usr/bin/env bash
#
# Script to generate private RSA key and a self-signed certificate under src/main/resources/localhost-ssl (git-ignored)
# These resources are used for exposing the application via HTTPS in development environment. They must not be used
# in other environments, as their purpose is to provide consistency, not security.
# Note the openssl command extension for macOS. For further details refer to: https://stackoverflow.com/a/64309893

localhost_ssl_folder="src/main/resources/localhost-ssl"

if [ ! -f "$localhost_ssl_folder"/localhost.key -o ! -f "$localhost_ssl_folder"/localhost.crt ]
then
  mkdir -p "$localhost_ssl_folder"

  if [[ $OSTYPE == "darwin"* ]]
  then
    openssl req \
      -nodes \
      -x509 \
      -newkey rsa:4096 \
      -keyout "$localhost_ssl_folder"/localhost.key \
      -out "$localhost_ssl_folder"/localhost.crt \
      -sha256 \
      -days 3650 \
      -subj "/C=GB/ST=A/L=B/O=C/OU=D/CN=E" \
      -extensions v3_new \
      -config <(cat /System/Library/OpenSSL/openssl.cnf \
      <(printf '[v3_new]\nsubjectAltName=DNS:host.docker.internal,DNS:localhost,IP:127.0.0.1\nextendedKeyUsage=serverAuth'))
  else
    openssl req \
      -nodes \
      -x509 \
      -newkey rsa:4096 \
      -keyout "$localhost_ssl_folder"/localhost.key \
      -out "$localhost_ssl_folder"/localhost.crt \
      -sha256 \
      -days 3650 \
      -subj "/C=GB/ST=A/L=B/O=C/OU=D/CN=E" \
      -addext "subjectAltName = DNS:host.docker.internal,DNS:localhost,IP:127.0.0.1" \
      -addext "extendedKeyUsage = serverAuth"
  fi
fi
