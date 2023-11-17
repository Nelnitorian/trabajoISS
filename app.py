# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 16:39:15 2023

@author: imper
"""

from flask import Flask, jsonify, request, Response
from datetime import datetime  # Importa el módulo datetime
import mysql.connector
import json


app = Flask(__name__)
conexion = mysql.connector.connect(
    user="salas", password="salas", host="localhost", database="incidencias", port="3306"
)

cursor = conexion.cursor()

incidencias = []


@app.route("/hello", methods=["GET"])
def hello_world():
    return jsonify({"message": "Hola Mundo"})


@app.route("/incidencias", methods=["POST"])
def crear_incidencia():
    data = request.get_json()

    if not all(key in data for key in ["Nombre", "numero_patin", "causa"]):
        return jsonify({"error": "Faltan campos obligatorios en la solicitud"}), 400

    hora_apertura = datetime.now().strftime(
        "%Y-%m-%d"
    )  # Obtiene la hora actual y la formatea

    cursor.execute(
        "INSERT INTO incidencias (nombre, numero_patin, causa, fecha_apertura, fecha_cierre) VALUES (%s, %s, %s, %s, %s)",
        (data["Nombre"], data["numero_patin"], data["causa"], hora_apertura, None),
    )

    conexion.commit()
    return jsonify({"message": "Incidencia creada con éxito"}), 201


@app.route("/incidencias", methods=["GET"])
def obtener_incidencias():
    cursor.execute("SELECT * FROM incidencias")
    resultados = cursor.fetchall()

    # creamos un diccionario que contendrá todo
    arreglo_json = {
        "id": f"{resultados[0][0]}",
        "nombre": f"{resultados[0][1]}",
        "numero_patin": f"{resultados[0][2]}",
        "causa": f"{resultados[0][3]}",
        "fecha_apertura": f"{resultados[0][4]}",
        "fecha_cierre": f"{resultados[0][5]}",
    }

    response = Response(
        response=json.dumps(arreglo_json, sort_keys=False),
        status=200,
        mimetype="application/json",
    )

    return response


@app.route("/incidencias", methods=["PUT"])
def actualizar_incidencia():
    data = request.get_json()

    if not all(key in data for key in ["Nombre", "numero_patin"]):
        return jsonify({"error": "Faltan campos obligatorios en la solicitud"}), 400

    nombre = data["Nombre"]
    numero_patin = data["numero_patin"]
    hora_cierre = datetime.now().strftime("%Y-%m-%d")

    cursor.execute(
        "UPDATE incidencias SET fecha_cierre = %s WHERE nombre = %s AND numero_patin= %s",
        (hora_cierre, nombre, numero_patin),
    )

    # Confirmar la transacción para aplicar los cambios
    conexion.commit()
    return jsonify({"message": "Incidencia actualizada con éxito"}), 200


@app.route("/incidencias", methods=["DELETE"])
def eliminar_incidencia():
    data = request.get_json()

    if not all(key in data for key in ["Nombre", "numero_patin"]):
        return jsonify({"error": "Faltan campos obligatorios en la solicitud"}), 400

    nombre = data["Nombre"]
    numero_patin = data["numero_patin"]

    for incidencia in incidencias:
        if (
            incidencia["Nombre"] == nombre
            and incidencia["numero_patin"] == numero_patin
        ):
            incidencias.remove(incidencia)
            return jsonify({"message": "Incidencia eliminada con éxito"}), 200

    return (
        jsonify(
            {
                "error": "No se encontró ninguna incidencia con el nombre y número de patin proporcionados"
            }
        ),
        404,
    )


if __name__ == "__main__":
    app.run(debug=True)

cursor.close()
conexion.close()
