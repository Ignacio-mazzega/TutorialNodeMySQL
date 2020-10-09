CREATE DATABASE database_links;

USE database_links; 
--Tabla usuarios
CREATE TABLE usuarios {
    idUsuario int,  not null,
    nombre varchar(20) not null,
    contraseña varchar(50) not null,
    fullname varchar(80) not null
};

ALTER TABLE usuarios
    ADD PRIMARY KEY(idUsuario);

ALTER TABLE usuarios
    MODIFY idUsuario int, not null AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE usuarios;  

--Tabla enlaces
CREATE TABLE links (
    idLink int not null,
    titulo varchar(20) not null,
    url varchar(255) not null,
    descripcion text,
    usuario_id int,
    created_at timestamp not null DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario)
);

ALTER TABLE links
    ADD PRIMARY KEY (idLink);

ALTER TABLE links
    MODIFY idLink int not null AUTO_INCREMENT, AUTO_INCREMENT=1;