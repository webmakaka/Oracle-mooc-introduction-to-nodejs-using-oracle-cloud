/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
module.exports = {
    server: {
        port: process.env.PORT || 8888
    },
    db: {
        connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "localhost/orcl",
        user: process.env.DBAAS_USER_NAME || "movies_usr",
        password: process.env.DBAAS_USER_PASSWORD || "oracle"
    }
};