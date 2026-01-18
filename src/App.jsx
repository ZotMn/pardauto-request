import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer';
import './App.css';

// ИМПОРТИРУЕМ ЛОГОТИП ИЗ ПАПКИ (Работает 100%)
import logo from './logo.png';

// --- НАСТРОЙКИ PDF ---
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
});

const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto', fontSize: 11 },
  logo: { width: 120, alignSelf: 'center', marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 15, textAlign: 'center', fontWeight: 'bold', color: '#1565C0' },
  section: { marginBottom: 10, padding: 10, border: '1px solid #eee', borderRadius: 4 },
  sectionTitle: { fontSize: 12, marginBottom: 8, color: '#1565C0', fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: 4 },
  row: { flexDirection: 'row', marginBottom: 6, borderBottom: '1px solid #f0f0f0', paddingBottom: 2 },
  label: { width: '35%', color: '#666', fontSize: 10 },
  value: { width: '65%', fontWeight: 'bold', fontSize: 11 }
});

// --- ВНУТРЕННОСТИ PDF ---
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Теперь используем локальный логотип */}
      <Image style={pdfStyles.logo} src={logo} />
      
      <Text style={pdfStyles.header}>Техническое Задание на подбор</Text>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>1. Данные запроса</Text>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Менеджер:</Text><Text style={pdfStyles.value}>{data.manager}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Дата:</Text><Text style={pdfStyles.value}>{data.date}</Text></View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>2. Данные клиента</Text>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>ФИО:</Text><Text style={pdfStyles.value}>{data.clientName}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Телефон:</Text><Text style={pdfStyles.value}>{data.clientPhone}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Email:</Text><Text style={pdfStyles.value}>{data.email}</Text></View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>3. Параметры автомобиля</Text>
        {/* Исправлено: руб. вместо значка */}
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Бюджет:</Text><Text style={{...pdfStyles.value, color: '#0066cc'}}>{data.budget}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Модель:</Text><Text style={pdfStyles.value}>{data.carModel}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Годы:</Text><Text style={pdfStyles.value}>{data.yearsFrom} — {data.yearsTo}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Двигатель:</Text><Text style={pdfStyles.value}>{data.engine}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Привод:</Text><Text style={pdfStyles.value}>{data.drive}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Коробка:</Text><Text style={pdfStyles.value}>{data.transmission}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Пробег:</Text><Text style={pdfStyles.value}>{data.mileage}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Откуда:</Text><Text style={pdfStyles.value}>{data.importRegion}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Город:</Text><Text style={pdfStyles.value}>{data.city}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Растаможка:</Text><Text style={pdfStyles.value}>{data.customs}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Цвет:</Text><Text style={pdfStyles.value}>{data.colors}</Text></View>
        
        <Text style={{fontSize: 10, color: '#666', marginTop: 10, fontWeight: 'bold'}}>Важные опции (Must Have):</Text>
        <Text style={{fontSize: 11, marginBottom: 5}}>{data.mustHaves || 'Нет'}</Text>

        <Text style={{fontSize: 10, color: '#666', marginTop: 5, fontWeight: 'bold'}}>Комментарии:</Text>
        <Text style={{fontSize: 11}}>{data.comments || 'Нет'}</Text>
      </View>
    </Page>
  </Document>
);

// --- САЙТ ---
export default function App() {
  const [formData, setFormData] = useState({
    manager: '', 
    date: new Date().toLocaleString('ru-RU'),
    clientName: '', clientPhone: '', email: '',
    budget: '', carModel: '', 
    yearsFrom: '', yearsTo: '',
    engine: '', drive: '', transmission: '',
    mileage: '', importRegion: '', city: '',
    customs: 'РФ', colors: '', mustHaves: '', comments: ''
  });

  useEffect(() => {
    setFormData(prev => ({...prev, date: new Date().toLocaleString('ru-RU').slice(0, 17)}));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 0) {
        if (val[0] === '7' || val[0] === '8') val = val.slice(1);
        let formatted = '+7 (';
        if (val.length > 0) formatted += val.slice(0, 3);
        if (val.length >= 3) formatted += ') ' + val.slice(3, 6);
        if (val.length >= 6) formatted += '-' + val.slice(6, 8);
        if (val.length >= 8) formatted += '-' + val.slice(8, 10);
        setFormData({ ...formData, clientPhone: formatted });
    } else {
        setFormData({ ...formData, clientPhone: '' });
    }
  };

  const handleBudgetBlur = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val) {
        // Добавляем слово "руб." текстом, чтобы не было квадратиков или 1/2
        val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб.';
    }
    setFormData({ ...formData, budget: val });
  };

  const generateAndShare = async () => {
    if (!formData.clientName) return alert('Пожалуйста, введите имя клиента!');
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const timeStr = now.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}).replace(':', '_');
    
    const safe = (str) => (str || 'unknown').trim().replace(/[\s\/\\:*?"<>|]+/g, '_');

    const fileName = `ТЗ_${safe(formData.manager)}_${safe(formData.clientName)}_${safe(formData.carModel)}_${dateStr}_${timeStr}.pdf`;

    const blob = await pdf(<MyDocument data={formData} />).toBlob();
    const file = new File([blob], fileName, { type: 'application/pdf' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'ТЗ на авто' }).catch(console.error);
    } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
  };

  return (
    <div className="container">
      <header className="page-header">
         {/* На сайте тоже показываем логотип из файла */}
         <img src={logo} alt="Logo" className="logo" />
      </header>

      <h1>📋 Техническое Задание на подбор</h1>

      <div className="section">
        <h2>1. Данные запроса</h2>
        <div className="form-group">
            <div>
                <label>Менеджер:</label>
                <select name="manager" value={formData.manager} onChange={handleChange}>
                    <option value="">-- Выберите --</option>
                    <option value="Артем">Артем</option>
                    <option value="Максим">Максим</option>
                    <option value="Роман">Роман</option>
                </select>
            </div>
            <div>
                <label>Дата и время:</label>
                <input value={formData.date} readOnly className="date-input" />
            </div>
        </div>
      </div>

      <div className="section">
        <h2>2. Данные клиента</h2>
        <div className="form-group full">
            <label>ФИО Клиента:</label>
            <input name="clientName" placeholder="Иванов Иван Иванович" value={formData.clientName} onChange={handleChange} />
        </div>
        <div className="form-group">
            <div>
                <label>Телефон:</label>
                <input name="clientPhone" placeholder="+7 (999) 000-00-00" value={formData.clientPhone} onChange={handlePhoneChange} />
            </div>
            <div>
                <label>Email:</label>
                <input name="email" placeholder="mail@example.com" value={formData.email} onChange={handleChange} />
            </div>
        </div>
      </div>

      <div className="section">
        <h2>3. Параметры автомобиля</h2>
        
        <div className="form-group">
            <div>
                <label>🎯 Бюджет «под ключ»:</label>
                <input name="budget" className="budget-input" placeholder="3 000 000" 
                       value={formData.budget} 
                       onChange={handleChange} 
                       onBlur={handleBudgetBlur} 
                       onFocus={(e) => setFormData({...formData, budget: e.target.value.replace(/\D/g, '')})}
                />
            </div>
            <div>
                <label>Марка и Модель:</label>
                <input name="carModel" placeholder="BMW X5, Kia K5..." value={formData.carModel} onChange={handleChange} />
            </div>
        </div>

        <div className="form-group">
            <div>
                <label>Годы (от - до):</label>
                <div style={{display: 'flex', gap: '10px'}}>
                    <input name="yearsFrom" type="number" placeholder="2018" value={formData.yearsFrom} onChange={handleChange} />
                    <input name="yearsTo" type="number" placeholder="2024" value={formData.yearsTo} onChange={handleChange} />
                </div>
            </div>
            <div>
                <label>Двигатель:</label>
                <select name="engine" value={formData.engine} onChange={handleChange}>
                    <option value="">-- Не важно --</option>
                    <option value="Бензин">Бензин</option>
                    <option value="Дизель">Дизель</option>
                    <option value="Электрический">Электрический</option>
                    <option value="Гибрид">Гибрид</option>
                </select>
            </div>
        </div>

        <div className="form-group">
            <div>
                <label>Коробка:</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange}>
                    <option value="">-- Выберите --</option>
                    <option value="Автомат (любой)">Автомат (любой)</option>
                    <option value="Классический АКПП">Классический АКПП</option>
                    <option value="Робот">Робот</option>
                    <option value="Вариатор">Вариатор</option>
                </select>
            </div>
            <div>
                <label>Привод:</label>
                <select name="drive" value={formData.drive} onChange={handleChange}>
                    <option value="">-- Не важно --</option>
                    <option value="Полный">Полный (4WD)</option>
                    <option value="Передний">Передний</option>
                    <option value="Задний">Задний</option>
                </select>
            </div>
        </div>

        <div className="form-group">
             <div>
                <label>Пробег (до км):</label>
                <input name="mileage" placeholder="100 000" value={formData.mileage} onChange={handleChange} />
             </div>
             <div>
                <label>Откуда привезти:</label>
                <select name="importRegion" value={formData.importRegion} onChange={handleChange}>
                    <option value="">-- Не важно --</option>
                    <option value="Китай">Китай</option>
                    <option value="Корея">Корея</option>
                    <option value="Европа">Европа</option>
                    <option value="Япония">Япония</option>
                    <option value="РФ">Местный рынок (РФ)</option>
                </select>
             </div>
        </div>

        <div className="form-group">
            <div>
                <label>Растаможка:</label>
                <select name="customs" value={formData.customs} onChange={handleChange}>
                    <option value="РФ">РФ</option>
                    <option value="Киргизия">Киргизия</option>
                    <option value="РБ">Беларусь</option>
                </select>
            </div>
             <div>
                <label>Город доставки:</label>
                <input name="city" placeholder="Москва..." value={formData.city} onChange={handleChange} />
             </div>
        </div>

        <div className="form-group full">
            <label>Цвет / Салон:</label>
            <input name="colors" placeholder="Черный на черном..." value={formData.colors} onChange={handleChange} />
        </div>

        <div className="form-group full">
            <label>Важные опции (Must Have):</label>
            <textarea name="mustHaves" placeholder="Панорама, Harman Kardon..." value={formData.mustHaves} onChange={handleChange} />
        </div>

        <div className="form-group full">
            <label>Комментарии:</label>
            <textarea name="comments" placeholder="Пожелания..." value={formData.comments} onChange={handleChange} />
        </div>
      </div>

      <button className="btn-primary" onClick={generateAndShare}>
        📥 Скачать / Отправить PDF
      </button>

    </div>
  );
}
