CREATE TABLE actor_affiliations (
    id integer NOT NULL,
    name character varying(64),
    for_human boolean
);

CREATE SEQUENCE actor_affiliations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE actor_affiliations_id_seq OWNED BY actor_affiliations.id;

CREATE TABLE actor_roles (
    id integer NOT NULL,
    name character varying(64),
    for_human boolean
);

CREATE SEQUENCE actor_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE actor_roles_id_seq OWNED BY actor_roles.id;

CREATE TABLE actor_types (
    id integer NOT NULL,
    name character varying(64),
    for_human boolean
);
CREATE SEQUENCE actor_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE actor_types_id_seq OWNED BY actor_types.id;

CREATE TABLE actors (
    id integer NOT NULL,
    name character varying(64),
    is_human boolean
);

CREATE TABLE actors_events (
    actor_id integer,
    event_id integer NOT NULL,
    role_id integer,
    type_id integer,
    affiliation_id integer
);

CREATE SEQUENCE actors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE actors_id_seq OWNED BY actors.id;

CREATE TABLE events (
    id integer NOT NULL
);

CREATE SEQUENCE events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE events_id_seq OWNED BY events.id;

CREATE TABLE locations (
    id integer NOT NULL,
    name character varying(128)
);

CREATE SEQUENCE locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE locations_id_seq OWNED BY locations.id;

CREATE TABLE scandal_consequences (
    id integer NOT NULL,
    name character varying(128)
);

CREATE SEQUENCE scandal_consequences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE scandal_consequences_id_seq OWNED BY scandal_consequences.id;

CREATE TABLE scandal_subtypes (
    id integer NOT NULL,
    parent_id integer,
    name character varying(128)
);

CREATE SEQUENCE scandal_subtypes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE scandal_subtypes_id_seq OWNED BY scandal_subtypes.id;

CREATE TABLE scandal_types (
    name character varying(128),
    id integer NOT NULL
);

CREATE SEQUENCE scandal_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE scandal_types_id_seq OWNED BY scandal_types.id;

CREATE TABLE scandals (
    name character varying(128),
    description text,
    type_id integer,
    id integer NOT NULL,
    subtype_id integer,
    consequences character varying(64)
);

CREATE SEQUENCE scandals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE scandals_id_seq OWNED BY scandals.id;

-- sequences

ALTER TABLE ONLY actor_affiliations ALTER COLUMN id SET DEFAULT nextval('actor_affiliations_id_seq'::regclass);
ALTER TABLE ONLY actor_roles ALTER COLUMN id SET DEFAULT nextval('actor_roles_id_seq'::regclass);
ALTER TABLE ONLY actor_types ALTER COLUMN id SET DEFAULT nextval('actor_types_id_seq'::regclass);
ALTER TABLE ONLY actors ALTER COLUMN id SET DEFAULT nextval('actors_id_seq'::regclass);
ALTER TABLE ONLY events ALTER COLUMN id SET DEFAULT nextval('events_id_seq'::regclass);
ALTER TABLE ONLY locations ALTER COLUMN id SET DEFAULT nextval('locations_id_seq'::regclass);
ALTER TABLE ONLY scandal_consequences ALTER COLUMN id SET DEFAULT nextval('scandal_consequences_id_seq'::regclass);
ALTER TABLE ONLY scandal_subtypes ALTER COLUMN id SET DEFAULT nextval('scandal_subtypes_id_seq'::regclass);
ALTER TABLE ONLY scandal_types ALTER COLUMN id SET DEFAULT nextval('scandal_types_id_seq'::regclass);
ALTER TABLE ONLY scandals ALTER COLUMN id SET DEFAULT nextval('scandals_id_seq'::regclass);

-- constraints

ALTER TABLE ONLY actor_affiliations
    ADD CONSTRAINT actor_affiliations_pk PRIMARY KEY (id);

ALTER TABLE ONLY actor_roles
    ADD CONSTRAINT actor_roles_pk PRIMARY KEY (id);

ALTER TABLE ONLY actor_types
    ADD CONSTRAINT actor_types_pk PRIMARY KEY (id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_pk PRIMARY KEY (event_id);

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY events
    ADD CONSTRAINT events_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY locations
    ADD CONSTRAINT locations_pk PRIMARY KEY (id);

ALTER TABLE ONLY scandal_consequences
    ADD CONSTRAINT scandal_consequences_pk PRIMARY KEY (id);

ALTER TABLE ONLY scandal_subtypes
    ADD CONSTRAINT scandal_subtypes_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY scandal_types
    ADD CONSTRAINT scandal_types_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY scandals
    ADD CONSTRAINT scandals_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_actors FOREIGN KEY (actor_id) REFERENCES actors(id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_affiliations FOREIGN KEY (affiliation_id) REFERENCES actor_affiliations(id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_events FOREIGN KEY (event_id) REFERENCES events(id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_roles FOREIGN KEY (role_id) REFERENCES actor_roles(id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_types FOREIGN KEY (type_id) REFERENCES actor_types(id);

ALTER TABLE ONLY scandal_subtypes
    ADD CONSTRAINT scandal_subtypes_scandal_types FOREIGN KEY (parent_id) REFERENCES scandal_types(id);

ALTER TABLE ONLY scandals
    ADD CONSTRAINT scandals_scandal_types FOREIGN KEY (type_id) REFERENCES scandal_types(id);
