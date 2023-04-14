import matplotlib.pyplot as plt

# Leer datos de los archivos
with open('cache_times.txt', 'r') as f:
    cache_times = [float(line.strip()) for line in f.readlines()]

with open('api_times.txt', 'r') as f:
    api_times = [float(line.strip()) for line in f.readlines()]

# Crear gráfico de líneas
x = range(1, len(cache_times)+1)
plt.plot(x, cache_times, color='blue', label='Tiempo de cache')
plt.plot(x, api_times, color='red', label='Tiempo de API')
plt.legend()
plt.xlabel('Consultas')
plt.ylabel('Tiempo (ms)')
plt.title('Tiempos de consulta')
plt.show()
