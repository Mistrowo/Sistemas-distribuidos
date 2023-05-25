import matplotlib.pyplot as plt

# Datos de las tres tablas
tiempo = [0, 0.5, 1,1.5, 2]

cpu1 = [149, 61.65, 36.22,50.78,29.82]
cpu2 = [130.61, 87.43, 66.08,57.45,52.87]
cpu3 = [125.09, 74.35, 30.11,76.97,96.86]

# Graficar los datos
plt.plot(tiempo, cpu1, marker='o', label='Kafka')
plt.plot(tiempo, cpu2, marker='o', label='Rabbit con patron fanout')
plt.plot(tiempo, cpu3, marker='o', label='Rabbit con patron topic')

# Personalizar la gráfica
plt.xlabel('Tiempo')
plt.ylabel('Uso de CPU (%)')
plt.title('Comparativa de CPU vs. Tiempo')
plt.grid(True)
plt.legend()

# Mostrar la gráfica
plt.show()
