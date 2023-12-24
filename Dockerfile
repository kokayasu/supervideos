# Use the official PostgreSQL image as the base image
# FROM groonga/pgroonga:3.1.3-debian-15
FROM postgres:15

# Set the locale environment variables for regular UTF-8
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# Update and install necessary packages
RUN apt-get update && apt-get install -y \
    postgresql-server-dev-15 \
    make \
    gcc \
    wget \
    libicu-dev

# Download and build pg_bigm
RUN wget https://osdn.dl.osdn.net/pgbigm/72448/pg_bigm-1.2-20200228.tar.gz --no-check-certificate && \
    tar zxf pg_bigm-1.2-20200228.tar.gz && \
    cd pg_bigm-1.2-20200228 && \
    make USE_PGXS=1 && \
    make USE_PGXS=1 install

# Add pg_bigm to shared_preload_libraries
RUN echo "shared_preload_libraries='pg_bigm'" >> /usr/share/postgresql/postgresql.conf.sample

# Copy the SQL script to initialize the database
# COPY ./scripts/setup_db.sql /docker-entrypoint-initdb.d/

# Set environment variables
ENV POSTGRES_DB videopurple
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
