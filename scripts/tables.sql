CREATE TABLE actors (
    id integer NOT NULL
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
    id integer NOT NULL
);

CREATE SEQUENCE scandals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE scandals_id_seq OWNED BY scandals.id;

-- sequences

ALTER TABLE ONLY actors ALTER COLUMN id SET DEFAULT nextval('actors_id_seq'::regclass);
ALTER TABLE ONLY events ALTER COLUMN id SET DEFAULT nextval('events_id_seq'::regclass);
ALTER TABLE ONLY scandal_subtypes ALTER COLUMN id SET DEFAULT nextval('scandal_subtypes_id_seq'::regclass);
ALTER TABLE ONLY scandal_types ALTER COLUMN id SET DEFAULT nextval('scandal_types_id_seq'::regclass);
ALTER TABLE ONLY scandals ALTER COLUMN id SET DEFAULT nextval('scandals_id_seq'::regclass);

-- constraint

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY events
    ADD CONSTRAINT events_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY scandal_subtypes
    ADD CONSTRAINT scandal_subtypes_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY scandal_types
    ADD CONSTRAINT scandal_types_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY scandals
    ADD CONSTRAINT scandals_id_pk PRIMARY KEY (id);

ALTER TABLE ONLY scandal_subtypes
    ADD CONSTRAINT scandal_subtypes_scandal_types FOREIGN KEY (parent_id) REFERENCES scandal_types(id);

ALTER TABLE ONLY scandals
    ADD CONSTRAINT scandals_scandal_types FOREIGN KEY (type_id) REFERENCES scandal_types(id);
