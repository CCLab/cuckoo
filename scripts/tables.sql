CREATE TABLE actor_affiliations (
    id integer NOT NULL,
    name character varying(64),
    human boolean
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
    human boolean
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
    human boolean
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
    human boolean
);

CREATE TABLE actors_events (
    actor_id integer NOT NULL,
    event_id integer NOT NULL,
    role_id integer,
    type_id integer,
    affiliation_id integer,
    tags character varying(128)[]
);

CREATE SEQUENCE actors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE actors_id_seq OWNED BY actors.id;

CREATE TABLE event_subtypes (
    id integer NOT NULL,
    parent_id integer,
    name character varying(128)
);

CREATE SEQUENCE event_subtypes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE event_subtypes_id_seq OWNED BY event_subtypes.id;

CREATE TABLE event_types (
    id integer NOT NULL,
    name character varying(128),
    parent integer
);

CREATE SEQUENCE event_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE event_types_id_seq OWNED BY event_types.id;

CREATE TABLE events (
    id integer NOT NULL,
    description text,
    scandal_id integer,
    location_id integer,
    event_date date,
    publication_date date,
    type_id integer,
    subtype_id integer,
    types integer[]
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
    id integer NOT NULL,
    parent integer
);

CREATE SEQUENCE scandal_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE scandal_types_id_seq OWNED BY scandal_types.id;

CREATE TABLE scandals (
    description text,
    type_id integer,
    id integer NOT NULL,
    subtype_id integer,
    consequences character varying(64),
    name character varying(128)[],
    tags character varying(128)[],
    types integer[]
);

CREATE SEQUENCE scandals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE scandals_id_seq OWNED BY scandals.id;

ALTER TABLE ONLY actor_affiliations ALTER COLUMN id SET DEFAULT nextval('actor_affiliations_id_seq'::regclass);

ALTER TABLE ONLY actor_roles ALTER COLUMN id SET DEFAULT nextval('actor_roles_id_seq'::regclass);

ALTER TABLE ONLY actor_types ALTER COLUMN id SET DEFAULT nextval('actor_types_id_seq'::regclass);

ALTER TABLE ONLY actors ALTER COLUMN id SET DEFAULT nextval('actors_id_seq'::regclass);

ALTER TABLE ONLY event_subtypes ALTER COLUMN id SET DEFAULT nextval('event_subtypes_id_seq'::regclass);

ALTER TABLE ONLY event_types ALTER COLUMN id SET DEFAULT nextval('event_types_id_seq'::regclass);

ALTER TABLE ONLY events ALTER COLUMN id SET DEFAULT nextval('events_id_seq'::regclass);

ALTER TABLE ONLY locations ALTER COLUMN id SET DEFAULT nextval('locations_id_seq'::regclass);

ALTER TABLE ONLY scandal_consequences ALTER COLUMN id SET DEFAULT nextval('scandal_consequences_id_seq'::regclass);

ALTER TABLE ONLY scandal_subtypes ALTER COLUMN id SET DEFAULT nextval('scandal_subtypes_id_seq'::regclass);

ALTER TABLE ONLY scandal_types ALTER COLUMN id SET DEFAULT nextval('scandal_types_id_seq'::regclass);

ALTER TABLE ONLY scandals ALTER COLUMN id SET DEFAULT nextval('scandals_id_seq'::regclass);

ALTER TABLE ONLY actor_affiliations
    ADD CONSTRAINT actor_affiliations_pk PRIMARY KEY (id);

ALTER TABLE ONLY actor_roles
    ADD CONSTRAINT actor_roles_pk PRIMARY KEY (id);

ALTER TABLE ONLY actor_types
    ADD CONSTRAINT actor_types_pk PRIMARY KEY (id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_pk PRIMARY KEY (actor_id, event_id);

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY event_subtypes
    ADD CONSTRAINT event_subtypes_pk PRIMARY KEY (id);

ALTER TABLE ONLY event_types
    ADD CONSTRAINT event_types_pk PRIMARY KEY (id);

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

CREATE INDEX fki_scandal_scandal_type ON scandals USING btree (type_id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_actors FOREIGN KEY (actor_id) REFERENCES actors(id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_affiliations FOREIGN KEY (affiliation_id) REFERENCES actor_affiliations(id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_events FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_roles FOREIGN KEY (role_id) REFERENCES actor_roles(id);

ALTER TABLE ONLY actors_events
    ADD CONSTRAINT actors_events_types FOREIGN KEY (type_id) REFERENCES actor_types(id);



ALTER TABLE ONLY event_types
    ADD CONSTRAINT event_types_parent FOREIGN KEY (parent) REFERENCES event_types(id) ON DELETE CASCADE;


ALTER TABLE ONLY events
    ADD CONSTRAINT events_scandals FOREIGN KEY (scandal_id) REFERENCES scandals(id);


ALTER TABLE ONLY scandal_types
    ADD CONSTRAINT scandal_types_parent FOREIGN KEY (parent) REFERENCES scandal_types(id) ON DELETE CASCADE;
