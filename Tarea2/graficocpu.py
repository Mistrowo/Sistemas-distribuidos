import matplotlib.pyplot as plt

# Datos de las tres tablas
tiempo = [1, 2, 5]

cpu1 = [1.9, 2.1, 2.35]
cpu2 = [17, 19, 22]
cpu3 = [30, 38, 41.5]

# Graficar los datos
plt.plot(tiempo, cpu1, marker='o', label='RabbitMQ 1 minutos')
plt.plot(tiempo, cpu2, marker='o', label='RabbitMQ 2 minutos')
plt.plot(tiempo, cpu3, marker='o', label='RabbitMQ 5 minutos')

# Personalizar la gráfica
plt.xlabel('Tiempo')
plt.ylabel('Uso de CPU (%)')
plt.title('Comparativa de CPU vs. Tiempo')
plt.grid(True)
plt.legend()

# Mostrar la gráfica
plt.show()
