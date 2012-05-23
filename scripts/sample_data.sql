INSERT INTO actor_affiliations VALUES (1, 'Centrum Cyfrowe', true);
INSERT INTO actor_affiliations VALUES (2, 'KRK', true);
INSERT INTO actor_affiliations VALUES (3, 'służba zdrowia', false);
INSERT INTO actor_affiliations VALUES (5, 'testowa afiliacja dla korpo', false);
INSERT INTO actor_affiliations VALUES (7, 'testowa afiliacja dla czlowieka', true);
INSERT INTO actor_affiliations VALUES (8, 'NASA', true);
INSERT INTO actor_affiliations VALUES (9, 'prasa', false);
INSERT INTO actor_affiliations VALUES (10, 'Rzeczpospolita Obojga Narodów', true);

INSERT INTO actor_roles VALUES (1, 'donosiciel', true);
INSERT INTO actor_roles VALUES (2, 'sprawca', true);
INSERT INTO actor_roles VALUES (3, 'beneficjent', false);
INSERT INTO actor_roles VALUES (4, 'nowa rola czlowiecza', true);
INSERT INTO actor_roles VALUES (5, 'nowa rola korpo', false);
INSERT INTO actor_roles VALUES (6, 'administrował exit-nodem', true);
INSERT INTO actor_roles VALUES (7, 'reklamowali go!', false);

INSERT INTO actor_types VALUES (1, 'poseł na Sejm', true);
INSERT INTO actor_types VALUES (2, 'senator RP', true);
INSERT INTO actor_types VALUES (3, 'biznesmen', true);
INSERT INTO actor_types VALUES (4, 'dziennikarz', true);
INSERT INTO actor_types VALUES (5, 'organizator', false);
INSERT INTO actor_types VALUES (6, 'nowy typ human', true);
INSERT INTO actor_types VALUES (7, 'nowy typ non-human', false);
INSERT INTO actor_types VALUES (8, 'haker', true);
INSERT INTO actor_types VALUES (9, 'dziennik', false);

INSERT INTO actors VALUES (1, 'Adam Mitnick', true);
INSERT INTO actors VALUES (2, 'Michał Czyżewski', true);
INSERT INTO actors VALUES (3, 'Gazeta Wyborcza', false);
INSERT INTO actors VALUES (4, 'Confuse-A-Cat Ltd.', false);
INSERT INTO actors VALUES (5, 'Kevin Michnik', false);
INSERT INTO actors VALUES (6, 'Kevin Michnik', false);
INSERT INTO actors VALUES (7, 'Instytucja', false);
INSERT INTO actors VALUES (8, 'coś jak człowiek', false);
INSERT INTO actors VALUES (9, 'osoba osoba', false);
INSERT INTO actors VALUES (10, '8soba', true);
INSERT INTO actors VALUES (11, 'nie8soba', false);
INSERT INTO actors VALUES (12, 'inst', false);
INSERT INTO actors VALUES (13, 'Kevin Michnik', true);
INSERT INTO actors VALUES (14, 'Dziennik Pomorski', false);

INSERT INTO event_types VALUES (1, 'publikacja');
INSERT INTO event_types VALUES (2, 'kradzież');
INSERT INTO event_types VALUES (3, 'nowy typ wydarzenia');

INSERT INTO event_subtypes VALUES (1, 1, 'w gazecie');
INSERT INTO event_subtypes VALUES (2, 1, 'w necie');
INSERT INTO event_subtypes VALUES (3, 2, '<= 200 PLN (niska szkodliwość)');
INSERT INTO event_subtypes VALUES (4, 2, '>200 PLN (skandal!)');
INSERT INTO event_subtypes VALUES (5, 3, 'dziecko nowego typu wydarzenia');
INSERT INTO event_subtypes VALUES (6, 3, 'drugie dziecko');
INSERT INTO event_subtypes VALUES (7, 3, 'trzecie dziecko');
INSERT INTO event_subtypes VALUES (8, 3, 'czwarte dziecko');
INSERT INTO event_subtypes VALUES (9, 3, 'już piąte dziecko');
INSERT INTO event_subtypes VALUES (10, 3, 'szóste dziecko');

INSERT INTO locations VALUES (1, 'ogólnopolskie');
INSERT INTO locations VALUES (2, 'międzynarodowe');
INSERT INTO locations VALUES (3, 'wirtualne');
INSERT INTO locations VALUES (4, 'Warszawa');
INSERT INTO locations VALUES (5, 'Poznań');
INSERT INTO locations VALUES (6, '3miasto');
INSERT INTO locations VALUES (7, 'Lublin');
INSERT INTO locations VALUES (8, 'lokacja');
INSERT INTO locations VALUES (9, 'sitnika');
INSERT INTO locations VALUES (10, 'testloc');
INSERT INTO locations VALUES (11, 'ff');
INSERT INTO locations VALUES (12, 'ddd');
INSERT INTO locations VALUES (13, 'ddw');
INSERT INTO locations VALUES (14, 'fru');
INSERT INTO locations VALUES (15, 'bru');
INSERT INTO locations VALUES (16, 'nu3');
INSERT INTO locations VALUES (17, 'nu4');

INSERT INTO scandal_types VALUES ('nepotyzm', 1);
INSERT INTO scandal_types VALUES ('inny typ afery', 2);
INSERT INTO scandal_types VALUES ('jeszcze inny typ z podtypami', 3);
INSERT INTO scandal_types VALUES ('something similar', 8);
INSERT INTO scandal_types VALUES ('typ afery dodany przez weba', 9);
INSERT INTO scandal_types VALUES ('hh', 10);
INSERT INTO scandal_types VALUES ('automagicznie', 11);
INSERT INTO scandal_types VALUES ('am', 12);

INSERT INTO scandals VALUES ('testowa afera', 'to nie jest prawdziwa afera', 1, 1, NULL, NULL);
INSERT INTO scandals VALUES ('nazwa', 'opis', NULL, 4, NULL, '1,3');
INSERT INTO scandals VALUES ('druga nowa', 'opis nowej z typami', 8, 5, 3, '4,6');
INSERT INTO scandals VALUES ('testowa 6?', 'soo', 1, 6, NULL, '2');
INSERT INTO scandals VALUES ('po zmianach jest', 'zapisujemy nowe afery. i stare też', 3, 7, 1, '1,3,6');
INSERT INTO scandals VALUES ('testing id saving', 'qwe', 2, 9, NULL, '3');
INSERT INTO scandals VALUES ('druga', 'druga testowa afera', 2, 2, NULL, '2');
INSERT INTO scandals VALUES ('psyco changes! ź! nu', 'utf tejścik zażółć gęślą jaźń. nu', 8, 8, 3, '1,2,3');

INSERT INTO events VALUES (18, 'coś opublikowane w internecie', 2, 4, '2012-05-18', '2012-05-22', 1, 2);
INSERT INTO events VALUES (19, 'coś ukradzione', 2, 6, '2012-05-21', NULL, 2, 4);
INSERT INTO events VALUES (20, 'niepusty', 2, 7, '2012-05-23', '2012-05-23', 1, 1);
INSERT INTO events VALUES (23, 'zażółć wydarzenie testowe', 8, 2, '2012-05-14', '2012-05-16', 3, 5);

INSERT INTO actors_events VALUES (2, 18, 1, 3, 2);
INSERT INTO actors_events VALUES (4, 19, 3, 5, 3);
INSERT INTO actors_events VALUES (1, 20, 2, 3, 2);
INSERT INTO actors_events VALUES (13, 23, NULL, 8, NULL);

INSERT INTO scandal_consequences VALUES (1, 'some consequence');
INSERT INTO scandal_consequences VALUES (2, 'another consequence');
INSERT INTO scandal_consequences VALUES (3, 'yet another one');
INSERT INTO scandal_consequences VALUES (20, 'inna konsekwencja');

INSERT INTO scandal_subtypes VALUES (1, 3, 'podtyp typu z podtypami');
INSERT INTO scandal_subtypes VALUES (2, 3, 'drugi podtyp');
INSERT INTO scandal_subtypes VALUES (3, 8, 'something similar child');
INSERT INTO scandal_subtypes VALUES (4, 8, 'new');
INSERT INTO scandal_subtypes VALUES (5, 8, 'óteef-ąćem');
INSERT INTO scandal_subtypes VALUES (6, 12, 'am2');
INSERT INTO scandal_subtypes VALUES (7, 8, 'nxchild');
