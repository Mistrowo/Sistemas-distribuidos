import matplotlib.pyplot as plt

# Lee los tiempos de consulta desde un archivo txt
with open('tiempos.txt', 'r') as f:
    tiempos = [float(line.strip()) for line in f]

# Crea una lista de números de consulta para el eje x
consultas = list(range(1, len(tiempos) + 1))

# Crea el gráfico de líneas
plt.plot(consultas, tiempos)

# Etiqueta los ejes y pone un título
plt.xlabel('Número de consulta')
plt.ylabel('Tiempo de consulta (ms)')
plt.title('Tiempos de consulta de Pokémon')

# Muestra el gráfico
plt.show()
