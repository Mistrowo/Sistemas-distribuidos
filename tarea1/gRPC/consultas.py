import matplotlib.pyplot as plt

# Lee los tiempos de consulta desde los archivos txt
with open('tiemposredis3.txt', 'r') as f1, open('tiemposredis3alto.txt', 'r') as f2:
    tiempos1 = [float(line.strip()) for line in f1]
    tiempos2 = [float(line.strip()) for line in f2]
    

# Crea listas de números de consulta para cada eje x
consultas1 = list(range(1, len(tiempos1) + 1))
consultas2 = list(range(1, len(tiempos2) + 1))


# Crea dos subgráficos
fig, (ax1, ax2) = plt.subplots(1, 2)

# Grafica los tiempos del primer archivo en el primer subgráfico
ax1.plot(consultas1, tiempos1)
ax1.set_xlabel('Número de consulta')
ax1.set_ylabel('Tiempo de consulta (ms)')
ax1.set_title('Archivo 1')

# Grafica los tiempos del segundo archivo en el segundo subgráfico
ax2.plot(consultas2, tiempos2)
ax2.set_xlabel('Número de consulta')
ax2.set_ylabel('Tiempo de consulta (ms)')
ax2.set_title('Archivo 2')

# Muestra los subgráficos
plt.show()

