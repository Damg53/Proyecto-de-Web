import React, { useState } from 'react';

const BotonComentarios = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [texto, setTexto] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Puerto correcto para tu servidor Express
  const API_BASE_URL = 'http://localhost:3001/api';

  // Estilos en tema oscuro
  const estilos = {
    container: {
      maxWidth: '32rem',
      margin: '0 auto',
      padding: '2rem',
      background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    containerOverlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '4px',
      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
      borderRadius: '1rem 1rem 0 0'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '800',
      marginBottom: '2rem',
      color: '#f1f5f9',
      textAlign: 'center',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputBase: {
      width: '100%',
      padding: '1rem 1.25rem',
      border: '2px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      lineHeight: '1.5',
      color: '#f1f5f9',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      outline: 'none'
    },
    inputPlaceholder: {
      '::placeholder': {
        color: '#94a3b8',
        opacity: '0.8'
      }
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)',
      transform: 'translateY(-2px)',
      backgroundColor: 'rgba(30, 41, 59, 0.95)'
    },
    inputDisabled: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      color: '#64748b',
      cursor: 'not-allowed',
      opacity: '0.7',
      borderColor: 'rgba(148, 163, 184, 0.1)'
    },
    textarea: {
      resize: 'none',
      minHeight: '140px',
      lineHeight: '1.6'
    },
    labelGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    label: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#cbd5e1',
      letterSpacing: '0.02em',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    button: {
      width: '100%',
      padding: '1rem 1.5rem',
      border: 'none',
      borderRadius: '0.75rem',
      fontWeight: '700',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      letterSpacing: '0.02em',
      position: 'relative',
      overflow: 'hidden'
    },
    buttonNormal: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: '#ffffff',
      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)'
    },
    buttonHover: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 20px 40px -5px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3)'
    },
    buttonDisabled: {
      background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
      color: '#94a3b8',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
    },
    spinner: {
      width: '1.25rem',
      height: '1.25rem',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    mensaje: {
      marginTop: '1.5rem',
      padding: '1.25rem',
      borderRadius: '0.75rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid',
      animation: 'slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    mensajeExito: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)'
    },
    mensajeError: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      borderColor: 'rgba(248, 113, 113, 0.3)',
      boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)'
    },
    debug: {
      marginTop: '2rem',
      padding: '1.25rem',
      background: 'rgba(15, 23, 42, 0.8)',
      borderRadius: '0.75rem',
      fontSize: '0.8rem',
      color: '#94a3b8',
      fontFamily: '"Fira Code", "SF Mono", "Consolas", monospace',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      backdropFilter: 'blur(10px)'
    },
    debugTitle: {
      color: '#f59e0b',
      fontWeight: '700',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const enviarComentario = async () => {
    setCargando(true);
    setMensaje('');

    // Validaciones mejoradas
    if (!nombre.trim()) {
      setMensaje('❌ El nombre es obligatorio');
      setCargando(false);
      return;
    }

    if (!correo.trim()) {
      setMensaje('❌ El correo electrónico es obligatorio');
      setCargando(false);
      return;
    }

    if (!validarEmail(correo.trim())) {
      setMensaje('❌ Ingresa un correo electrónico válido');
      setCargando(false);
      return;
    }

    if (!texto.trim()) {
      setMensaje('❌ El comentario no puede estar vacío');
      setCargando(false);
      return;
    }

    if (texto.trim().length < 10) {
      setMensaje('❌ El comentario debe tener al menos 10 caracteres');
      setCargando(false);
      return;
    }

    try {
      console.log('Iniciando proceso de envío de comentario...');
      
      // Primero crear/obtener el usuario
      let usuario;
      
      console.log('Creando/obteniendo usuario...');
      const usuarioResponse = await fetch(`${API_BASE_URL}/usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          nombre: nombre.trim(), 
          correo: correo.trim() 
        })
      });

      console.log('Respuesta usuario:', usuarioResponse.status);

      if (usuarioResponse.ok) {
        usuario = await usuarioResponse.json();
        console.log('Usuario obtenido:', usuario);
      } else {
        // Si el POST falla, intentar obtener usuarios existentes
        console.log('POST falló, intentando obtener usuarios existentes...');
        
        const usuariosResponse = await fetch(`${API_BASE_URL}/usuario`);
        
        if (!usuariosResponse.ok) {
          throw new Error(`Error al obtener usuarios: ${usuariosResponse.status}`);
        }
        
        const usuarios = await usuariosResponse.json();
        usuario = usuarios.find(u => u.correo === correo.trim());
        
        if (!usuario) {
          const errorData = await usuarioResponse.text();
          throw new Error(`No se pudo crear/encontrar el usuario. Error: ${errorData}`);
        }
        
        console.log('Usuario encontrado:', usuario);
      }

      // Verificar que tenemos un usuario válido
      if (!usuario || !usuario.id) {
        throw new Error('No se pudo obtener un ID de usuario válido');
      }

      // Crear la opinión
      console.log('Creando opinión...');
      const opinionResponse = await fetch(`${API_BASE_URL}/opiniones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          contenido: texto.trim(),
          puntuacion: parseInt(puntuacion),
          usuario_id: usuario.id
        })
      });

      console.log('Respuesta opinión:', opinionResponse.status);

      if (opinionResponse.ok) {
        const opinionData = await opinionResponse.json();
        console.log('Opinión creada:', opinionData);
        
        setMensaje('✅ ¡Comentario enviado correctamente!');
        
        // Limpiar formulario
        setNombre('');
        setCorreo('');
        setTexto('');
        setPuntuacion(5);
        
        // Limpiar mensaje después de 4 segundos
        setTimeout(() => setMensaje(''), 4000);
      } else {
        const errorData = await opinionResponse.text();
        throw new Error(`Error al crear opinión: ${opinionResponse.status} - ${errorData}`);
      }

    } catch (err) {
      console.error('Error completo:', err);
      
      // Mensajes de error más específicos
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setMensaje('❌ No se puede conectar al servidor. Verifica que esté corriendo en el puerto correcto.');
      } else if (err.message.includes('404')) {
        setMensaje('❌ Endpoint no encontrado. Verifica las rutas de tu API.');
      } else if (err.message.includes('500')) {
        setMensaje('❌ Error interno del servidor. Revisa los logs del backend.');
      } else {
        setMensaje(`❌ Error: ${err.message}`);
      }
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener estilos combinados
  const getInputStyle = (base) => ({
    ...base,
    ...(cargando ? estilos.inputDisabled : {})
  });

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes slideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          input::placeholder,
          textarea::placeholder {
            color: #94a3b8 !important;
            opacity: 0.8;
          }
          
          select {
            color: #f1f5f9 !important;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") !important;
            background-position: right 0.75rem center !important;
            background-repeat: no-repeat !important;
            background-size: 1.5em 1.5em !important;
            padding-right: 2.5rem !important;
          }
          
          option {
            background-color: #1e293b !important;
            color: #f1f5f9 !important;
          }
        `}
      </style>
      
      <div style={estilos.container}>
        <div style={estilos.containerOverlay}></div>
        
        <h2 style={estilos.title}>💬 Comparte tu Experiencia</h2>
        
        <div style={estilos.form}>
          <input 
            type="text" 
            placeholder="¿Cómo te llamas?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={cargando}
            style={getInputStyle(estilos.inputBase)}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.95)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
              e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
            }}
          />
          
          <input 
            type="email" 
            placeholder="tu.email@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={cargando}
            style={getInputStyle(estilos.inputBase)}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.95)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
              e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
            }}
          />
          
          <div style={estilos.labelGroup}>
            <label style={estilos.label}>
              <span>⭐</span>
              <span>Califica tu experiencia</span>
            </label>
            <select 
              value={puntuacion} 
              onChange={(e) => setPuntuacion(e.target.value)}
              disabled={cargando}
              style={getInputStyle(estilos.inputBase)}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)';
                e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.95)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
              }}
            >
              <option value={1}>⭐ Muy decepcionante</option>
              <option value={2}>⭐⭐ Necesita mejoras</option>
              <option value={3}>⭐⭐⭐ Está bien</option>
              <option value={4}>⭐⭐⭐⭐ Me gustó mucho</option>
              <option value={5}>⭐⭐⭐⭐⭐ ¡Increíble experiencia!</option>
            </select>
          </div>
          
          <textarea
            placeholder="Cuéntanos qué te pareció... (mínimo 10 caracteres)"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            disabled={cargando}
            rows="5"
            style={{...getInputStyle(estilos.inputBase), ...estilos.textarea}}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.95)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
              e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
            }}
          />
          
          <button 
            onClick={enviarComentario} 
            disabled={cargando}
            style={{
              ...estilos.button,
              ...(cargando ? estilos.buttonDisabled : estilos.buttonNormal)
            }}
            onMouseEnter={(e) => {
              if (!cargando) {
                e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 20px 40px -5px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!cargando) {
                e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)';
              }
            }}
          >
            {cargando ? (
              <>
                <div style={estilos.spinner}></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Enviar mi comentario</span>
              </>
            )}
          </button>
        </div>
        
        {mensaje && (
          <div style={{
            ...estilos.mensaje,
            ...(mensaje.includes('✅') ? estilos.mensajeExito : estilos.mensajeError)
          }}>
            <span style={{fontSize: '1.2rem'}}>{mensaje.includes('✅') ? '🎉' : '⚠️'}</span>
            <span>{mensaje}</span>
          </div>
        )}
        
        {/* Panel de debug mejorado */}
        <div style={estilos.debug}>
          <div style={estilos.debugTitle}>
            <span>🔧</span>
            <span>Panel de Desarrollo</span>
          </div>
          <div style={{display: 'grid', gap: '0.25rem'}}>
            <div><strong>Endpoint:</strong> {API_BASE_URL}</div>
            <div><strong>Estado:</strong> {cargando ? '⏳ Procesando' : '✅ Listo'}</div>
            <div><strong>Caracteres:</strong> {texto.length}/∞</div>
            <div><strong>Validación:</strong> {
              texto.length >= 10 && nombre.trim() && correo.trim() ? 
              '✅ Formulario válido' : 
              '❌ Faltan campos'
            }</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BotonComentarios;