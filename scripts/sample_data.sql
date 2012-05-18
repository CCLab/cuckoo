INSERT INTO actor_affiliations VALUES (1, 'Centrum Cyfrowe', NULL);
INSERT INTO actor_affiliations VALUES (2, 'KRK', NULL);

INSERT INTO actor_roles VALUES (1, 'donosiciel', NULL);
INSERT INTO actor_roles VALUES (2, 'sprawca', NULL);

INSERT INTO actor_types VALUES (1, 'poseł na Sejm', NULL);
INSERT INTO actor_types VALUES (2, 'senator RP', NULL);
INSERT INTO actor_types VALUES (3, 'biznesmen', NULL);
INSERT INTO actor_types VALUES (4, 'dziennikarz', NULL);

INSERT INTO actors VALUES (1, 'Adam Mitnick', true);
INSERT INTO actors VALUES (2, 'Michał Czyżewski', true);
INSERT INTO actors VALUES (3, 'Gazeta Wyborcza', false);
INSERT INTO actors VALUES (4, 'Confuse-A-Cat Ltd.', false);

INSERT INTO locations VALUES (1, 'ogólnopolskie');
INSERT INTO locations VALUES (2, 'międzynarodowe');
INSERT INTO locations VALUES (3, 'wirtualne');
INSERT INTO locations VALUES (4, 'Warszawa');
INSERT INTO locations VALUES (5, 'Poznań');
INSERT INTO locations VALUES (6, '3miasto');

INSERT INTO scandal_consequences VALUES (1, 'some consequence');
INSERT INTO scandal_consequences VALUES (2, 'another consequence');
INSERT INTO scandal_consequences VALUES (3, 'yet another one');
INSERT INTO scandal_consequences VALUES (4, 'choose one or more');

INSERT INTO scandal_types VALUES ('nepotyzm', 1);
INSERT INTO scandal_types VALUES ('inny typ afery', 2);
INSERT INTO scandal_types VALUES ('jeszcze inny typ z podtypami', 3);

INSERT INTO scandal_subtypes VALUES (1, 3, 'podtyp typu z podtypami');
INSERT INTO scandal_subtypes VALUES (2, 3, 'drugi podtyp');

INSERT INTO scandals VALUES ('testowa afera', 'to nie jest prawdziwa afera', 1, 1, NULL, NULL);
INSERT INTO scandals VALUES ('druga', 'druga testowa afera', 3, 2, 2, '2,4');
