# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 16:39:15 2023

@author: imper
"""

from flask import Flask, jsonify, request, Response, send_from_directory, redirect
from datetime import datetime  # Importa el módulo datetime
import mysql.connector
import json


app = Flask(__name__)

db_config = {
    "user": "salas",
    "password": "salas", 
    "host": "localhost", 
    "database": "trabajoISS",
    "port": "3306",
 }

def get_db_connection():
    return mysql.connector.connect(**db_config)

def close_db_connection(connection, cursor):
    cursor.close()
    connection.close()

incidencias = []


@app.route("/", methods=["GET"])
def home():
    return redirect("app")


@app.route("/app", methods=["GET"])
def main():
    return send_from_directory("www", "index.html")


@app.route('/app/<path:filename>', methods=["GET"])
def serve_static(filename):
    return send_from_directory('www', filename)


@app.route("/incidencias/", methods=["POST"])
def crear_incidencia():
    data = request.get_json()

    if not all(key in data for key in ["nombre", "numero_patin", "causa"]):
        return jsonify({"error": "Faltan campos obligatorios en la solicitud"}), 400

    hora_apertura = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )  # Obtiene la hora actual y la formatea
    try:
        conexion = get_db_connection()
        cursor = conexion.cursor()
        query = """
            INSERT INTO incidencias (nombre, numero_patin, causa, fecha_apertura, fecha_cierre, cerrado)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (data["nombre"], data["numero_patin"], data["causa"], hora_apertura, None, False)
        cursor.execute(query, values)
        conexion.commit()
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al crear la incidencia: {err}"}), 500
    finally:
        close_db_connection(conexion, cursor)

    return jsonify({"message": "Incidencia creada con éxito"}), 201


@app.route("/incidencias/", methods=["GET"])
def obtener_incidencias():
    try:
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM incidencias")
        resultados = cursor.fetchall()

        # creamos un diccionario que contendrá todo
        resultados_json = []
        for resultado in resultados:
            resultados_json.append({
                "id": f"{resultado[0]}",
                "nombre": f"{resultado[1]}",
                "numero_patin": f"{resultado[2]}",
                "causa": f"{resultado[3]}",
                "fecha_apertura": f"{resultado[4]}",
                "fecha_cierre": f"{resultado[5]}",
            })
        
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al obtener las incidencias: {err}"}), 500
    finally:
        close_db_connection(conexion, cursor)

    response = Response(
        response=json.dumps(resultados_json, sort_keys=False),
        status=200,
        mimetype="application/json",
    )

    return response

@app.route("/incidencias/<path:filename>", methods=["GET"])
def obtener_incidencia(filename):
    try:
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute(f"SELECT * FROM incidencias WHERE id={filename}")
        resultados = cursor.fetchall()

        # creamos un diccionario que contendrá todo
        resultado_json = {
            "id": f"{resultados[0][0]}",
            "nombre": f"{resultados[0][1]}",
            "numero_patin": f"{resultados[0][2]}",
            "causa": f"{resultados[0][3]}",
            "fecha_apertura": f"{resultados[0][4]}",
            "fecha_cierre": f"{resultados[0][5]}",
            "cerrado": f"{resultados[0][6]}",
        }
        
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al obtener las incidencias: {err}"}), 500
    finally:
        close_db_connection(conexion, cursor)

    response = Response(
        response=json.dumps(resultado_json, sort_keys=False),
        status=200,
        mimetype="application/json",
    )

    return response

@app.route("/incidencias/<path:filename>", methods=["PUT"])
def actualizar_incidencia(filename):
    id = filename

    hora_cierre = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute(
            "UPDATE incidencias SET fecha_cierre = %s, cerrado = %s WHERE id = %s",
            (hora_cierre, True, id),
        )
        # Confirmar la transacción para aplicar los cambios
        conexion.commit()
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al obtener las incidencias: {err}"}), 500
    finally:
        close_db_connection(conexion, cursor)
    
    return jsonify({"message": "Incidencia actualizada con éxito"}), 200


@app.route("/incidencias/<path:filename>", methods=["DELETE"])
def eliminar_incidencia(filename):
    id = filename

    try:
        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute(f"DELETE FROM incidencias WHERE id = {id}")
        conexion.commit()
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al obtener las incidencias: {err}"}), 500
    finally:
        close_db_connection(conexion, cursor)

    return jsonify({"message": "Incidencia eliminada con éxito"}), 200


if __name__ == "__main__":
    app.run(debug=True)

