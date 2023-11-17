USE trabajoISS;
DROP TABLE incidencias;
CREATE TABLE incidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    numero_patin INT,
    causa VARCHAR(100),
    fecha_apertura DATE,
    fecha_cierre DATE
);

INSERT INTO incidencias (id, nombre, numero_patin, causa, fecha_apertura, fecha_cierre) 
VALUES (1, 'paco', 12, 'Fallo técnico', '2023-01-01', '2023-01-01');