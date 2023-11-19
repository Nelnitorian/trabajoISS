USE trabajoISS;
DROP TABLE incidencias;
CREATE TABLE incidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    numero_patin INT,
    causa VARCHAR(100),
    fecha_apertura DATETIME,
    fecha_cierre DATETIME
);

INSERT INTO incidencias (id, nombre, numero_patin, causa, fecha_apertura, fecha_cierre) 
VALUES (1, 'paco', 12, 'Fallo técnico', '2023-01-01 12:12:12', '2023-01-01 23:23:23');
VALUES (2, 'pepe', 13, 'Robo', '2023-01-02 13:13:13', '2023-01-03 22:22:22');