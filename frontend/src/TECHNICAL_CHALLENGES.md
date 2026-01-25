## Informe Técnico: Implementación de UI Optimista y Sincronización Blockchain

1. El Problema: La espera en Blockchain Las transacciones en redes como Sepolia tardan en confirmarse (desde 15 segundos a varios minutos). Si dejamos al usuario esperando con un icono de carga todo ese tiempo, la experiencia es mala. Para arreglar esto, implementé una UI Optimista: la aplicación muestra los cambios (crear, borrar, transferir) al instante, como si ya hubieran ocurrido, mientras la red procesa la operación real por detrás.

2. Gestión de Datos: El Hash y la visualización inmediata Aunque podemos predecir cuál será el siguiente ID del producto consultando al contrato, el verdadero problema es que al crear el dato en nuestra base de datos, todavía nos falta el Hash de la transacción. Ese Hash es la única prueba real de que la operación existe en la Blockchain.

Solución: Uso un objeto temporal en el frontend para poder pintar la lista inmediatamente sin esperar a la red. Este objeto usa un ID temporal interno para que React no se queje al renderizar listas. Cuando la red confirma y tenemos el Hash, el sistema actualiza ese registro temporal con los datos reales y confirmados.

3. Arquitectura y Comunicación entre Componentes Al crecer la aplicación, surgió la necesidad de comunicar el estado de la transacción (que se gestiona globalmente) con botones que están muy adentro en la interfaz (dentro de las tarjetas de producto).

Decisión técnica (Prop Drilling): Para conectar el gestor global con estos componentes específicos sin reescribir toda la arquitectura a mitad del proyecto, opté por pasar las funciones de control (onRefetch, onRollback) a través de las propiedades de los componentes.

Motivo: Es una solución estándar y robusta que asegura que los datos viajan de forma directa, priorizando la estabilidad y el funcionamiento inmediato sobre una refactorización compleja.

4. Sistema de Verificación y Persistencia Para asegurar que los datos son consistentes incluso si el usuario cierra la pestaña o la red falla, el sistema tiene varias capas de seguridad:

- Store Global (Zustand): Mantiene la cola de operaciones pendientes para que no se pierdan al navegar por la web.

- Gestor en Segundo Plano (Frontend): Un componente en el layout que consulta periódicamente (polling) el estado de la transacción. En cuanto detecta el éxito, actualiza la interfaz visual.

- Recuperación al Recargar: Si el usuario refresca la página, un gestor revisa si había tareas pendientes y consulta si ya finalizaron para quitar los indicadores de carga.

- Verificación Real (Backend): Esta es la pieza clave. El Backend (Java/Spring) tiene un escuchador (listener) de eventos del Smart Contract. Cuando la Blockchain emite el evento real, el Backend lo captura, busca el producto en la base de datos y lo marca oficialmente como "Verificado". El frontend simplemente lee este estado final de la base de datos, cerrando el círculo de verificación.

5. Siguientes pasos El sistema funciona y es estable. Para limpiar el código en el futuro y evitar pasar tantas propiedades de un componente a otro, el paso natural sería integrar TanStack Query. Esto permitiría recargar los datos desde cualquier punto de la aplicación sin necesidad de conectar manualmente los componentes padres con los hijos.