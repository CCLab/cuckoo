INSERT INTO actor_affiliations VALUES (1, 'Centrum Cyfrowe', true);
INSERT INTO actor_affiliations VALUES (2, 'KRK', true);
INSERT INTO actor_affiliations VALUES (3, 'służba zdrowia', false);
INSERT INTO actor_affiliations VALUES (5, 'testowa afiliacja dla korpo', false);
INSERT INTO actor_affiliations VALUES (7, 'testowa afiliacja dla czlowieka', true);

INSERT INTO actor_roles VALUES (1, 'donosiciel', true);
INSERT INTO actor_roles VALUES (2, 'sprawca', true);
INSERT INTO actor_roles VALUES (3, 'beneficjent', false);
INSERT INTO actor_roles VALUES (4, 'nowa rola czlowiecza', true);
INSERT INTO actor_roles VALUES (5, 'nowa rola korpo', false);

INSERT INTO actor_types VALUES (1, 'poseł na Sejm', true);
INSERT INTO actor_types VALUES (2, 'senator RP', true);
INSERT INTO actor_types VALUES (3, 'biznesmen', true);
INSERT INTO actor_types VALUES (4, 'dziennikarz', true);
INSERT INTO actor_types VALUES (5, 'organizator', false);
INSERT INTO actor_types VALUES (6, 'nowy typ human', true);
INSERT INTO actor_types VALUES (7, 'nowy typ non-human', false);

INSERT INTO actors VALUES (1, 'Adam Mitnick', true);
INSERT INTO actors VALUES (2, 'Michał Czyżewski', true);
INSERT INTO actors VALUES (3, 'Gazeta Wyborcza', false);
INSERT INTO actors VALUES (4, 'Confuse-A-Cat Ltd.', false);

INSERT INTO event_types VALUES (1, 'publikacja');
INSERT INTO event_types VALUES (2, 'kradzież');
INSERT INTO event_types VALUES (3, 'nowy typ wydarzenia');

INSERT INTO event_subtypes VALUES (1, 1, 'w gazecie');
INSERT INTO event_subtypes VALUES (2, 1, 'w necie');
INSERT INTO event_subtypes VALUES (3, 2, '<= 200 PLN (niska szkodliwość)');
INSERT INTO event_subtypes VALUES (4, 2, '>200 PLN (skandal!)');
INSERT INTO event_subtypes VALUES (5, 3, 'dziecko nowego typu wydarzenia');

INSERT INTO locations VALUES (1, 'ogólnopolskie');
INSERT INTO locations VALUES (2, 'międzynarodowe');
INSERT INTO locations VALUES (3, 'wirtualne');
INSERT INTO locations VALUES (4, 'Warszawa');
INSERT INTO locations VALUES (5, 'Poznań');
INSERT INTO locations VALUES (6, '3miasto');
INSERT INTO locations VALUES (7, 'Lublin');

INSERT INTO scandal_types VALUES ('nepotyzm', 1);
INSERT INTO scandal_types VALUES ('inny typ afery', 2);
INSERT INTO scandal_types VALUES ('jeszcze inny typ z podtypami', 3);
INSERT INTO scandal_types VALUES ('something similar', 8);

INSERT INTO scandals VALUES ('testowa afera', 'to nie jest prawdziwa afera', 1, 1, NULL, NULL);
INSERT INTO scandals VALUES ('druga', 'druga testowa afera', 3, 2, 2, '2,4');

INSERT INTO events VALUES (1, 'coś opublikowane w internecie', 2, 4, NULL, NULL, 1, 2);
INSERT INTO events VALUES (2, 'coś ukradzione', 2, 6, NULL, NULL, 2, 4);

INSERT INTO actors_events VALUES (2, 1, 1, 3, 2);
INSERT INTO actors_events VALUES (4, 2, 3, 5, 3);

INSERT INTO scandal_consequences VALUES (1, 'some consequence');
INSERT INTO scandal_consequences VALUES (2, 'another consequence');
INSERT INTO scandal_consequences VALUES (3, 'yet another one');
INSERT INTO scandal_consequences VALUES (4, 'choose one or more');
INSERT INTO scandal_consequences VALUES (5, '');
INSERT INTO scandal_consequences VALUES (6, 'testowe konsekwencje afery');

INSERT INTO scandal_subtypes VALUES (1, 3, 'podtyp typu z podtypami');
INSERT INTO scandal_subtypes VALUES (2, 3, 'drugi podtyp');
INSERT INTO scandal_subtypes VALUES (3, 8, 'something similar child');
