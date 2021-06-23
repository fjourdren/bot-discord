CREATE TABLE IF NOT EXISTS user (
    id char(18) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS server (
    id char(18) NOT NULL,
    name varchar(100),
    owner_user_id char(18),
    botEnable boolean NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS category (
    id char(18) NOT NULL,
    server_id char(18) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS channel (
    id char(18) NOT NULL,
    server_id char(18) NOT NULL,
    category_id char(18),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sanction (
    name varchar(20) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS behavior (
    name varchar(10) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS command (
    id serial,
    server_id char(18) NOT NULL,
    need_permission_value int NOT NULL,
    sanction_name varchar(20) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS rank (
    id serial,
    name varchar(20) NOT NULL,
    server_id char(18) NOT NULL,
    category_id char(18),
    channel_id char(18), -- default null = tous les channels du serveur
    value int,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS behaviors_servers (
    behavior_name varchar(10) NOT NULL,
    server_id char(18) NOT NULL,
    enable boolean NOT NULL DEFAULT 1,
    PRIMARY KEY (behavior_name, server_id)
);

CREATE TABLE IF NOT EXISTS sanctions_users (
    id serial,
    user_id char(18) NOT NULL,
    server_id char(18) NOT NULL,
    channel_id char(18),
    category_id char(18),
    modoUserId char(18),
    sanction_name varchar(20) NOT NULL,
    dateStart datetime,
    dateEnd datetime,
    reason varchar(200),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ranks_users (
    user_id char(18) NOT NULL,
    rank_id int NOT NULL,
    PRIMARY KEY (user_id, rank_id)
);

ALTER TABLE server ADD FOREIGN KEY (owner_user_id) REFERENCES user(id);

ALTER TABLE category ADD FOREIGN KEY (server_id) REFERENCES server(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE channel ADD FOREIGN KEY (server_id) REFERENCES server(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE channel ADD FOREIGN KEY (category_id) REFERENCES category(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE command ADD FOREIGN KEY (server_id) REFERENCES server(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE command ADD FOREIGN KEY (sanction_name) REFERENCES sanction(name) ON UPDATE CASCADE;

ALTER TABLE rank ADD FOREIGN KEY (server_id) REFERENCES server(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE rank ADD FOREIGN KEY (category_id) REFERENCES category(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE rank ADD FOREIGN KEY (channel_id) REFERENCES channel(id) ON DELETE CASCADE;

ALTER TABLE behaviors_servers ADD FOREIGN KEY (behavior_name) REFERENCES behavior(name);
ALTER TABLE behaviors_servers ADD FOREIGN KEY (server_id) REFERENCES server(id);

ALTER TABLE sanctions_users ADD FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE sanctions_users ADD FOREIGN KEY (server_id) REFERENCES server(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE sanctions_users ADD FOREIGN KEY (channel_id) REFERENCES channel(id) ON DELETE CASCADE;
ALTER TABLE sanctions_users ADD FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE;
ALTER TABLE sanctions_users ADD FOREIGN KEY (modoUserId) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE sanctions_users ADD FOREIGN KEY (sanction_name) REFERENCES sanction(name) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ranks_users ADD FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ranks_users ADD FOREIGN KEY (rank_id) REFERENCES rank(id) ON UPDATE CASCADE ON DELETE CASCADE;




INSERT INTO user VALUES ('186130195361693698');
INSERT INTO user VALUES ('296319337424355330');
INSERT INTO user VALUES ('585715863349624832');

INSERT INTO server VALUES ('584827895697113109');

INSERT INTO category VALUES ('585939306183655426', '584827895697113109');

INSERT INTO channel VALUES ('584827896204492803', '584827895697113109', '585939306183655426');

INSERT INTO sanction VALUES ('AVERTIR');
INSERT INTO sanction VALUES ('MUET');
INSERT INTO sanction VALUES ('SOURD');
INSERT INTO sanction VALUES ('EXCLURE');
INSERT INTO sanction VALUES ('BAN');

INSERT INTO behavior VALUES ('SWEAR');
INSERT INTO behavior VALUES ('SPAM');
INSERT INTO behavior VALUES ('FLOOD');

INSERT INTO command(server_id, need_permission_value, sanction_name) VALUES ('584827895697113109', 10, 'BAN');
INSERT INTO command(server_id, need_permission_value, sanction_name) VALUES ('584827895697113109', 10, 'MUET');

INSERT INTO rank(name, server_id, value) VALUES ('Modérateur', '584827895697113109', 10);
INSERT INTO rank(name, server_id, value) VALUES ('Maitre du jeu', '584827895697113109', 9);

INSERT INTO behaviors_servers (behavior_name, server_id) VALUES ('SWEAR', 584827895697113109);
INSERT INTO behaviors_servers (behavior_name, server_id) VALUES ('SPAM', 584827895697113109);
INSERT INTO behaviors_servers (behavior_name, server_id) VALUES ('FLOOD', 584827895697113109);

INSERT INTO sanctions_users (user_id, server_id, modoUserId, sanction_name, reason) VALUES ('296319337424355330', '584827895697113109', '186130195361693698', 'BAN', 'Il est pas top 10 Dota2');

INSERT INTO ranks_users VALUES ('186130195361693698', 1);
INSERT INTO ranks_users VALUES ('296319337424355330', 2);
