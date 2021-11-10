--CREATE DATABASE market_cubos;

CREATE TABLE usuarios(
id serial PRIMARY KEY,
nome varchar(100) NOT NULL,
nome_loja varchar(30) NOT NULL,
email text NOT NULL UNIQUE,
senha text NOT NULL
);

CREATE TABLE produtos(
id serial PRIMARY KEY,
usuario_id int REFERENCES usuarios(id),
nome varchar(100) NOT NULL,
quantidade int NOT NULL,
categoria text,
preco int NOT NULL,
descricao text NOT NULL,
imagem text
);