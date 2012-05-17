INSERT INTO scandal_types VALUES ('nepotyzm', 1);
INSERT INTO scandal_types VALUES ('inny typ afery', 2);
INSERT INTO scandal_types VALUES ('jeszcze inny typ z podtypami', 3);

INSERT INTO scandal_subtypes VALUES (1, 3, 'podtyp typu z podtypami');

INSERT INTO scandals VALUES ('testowa afera', 'to nie jest prawdziwa afera', 1, 1);
INSERT INTO scandals VALUES ('druga', 'druga testowa afera', 1, 2);
