// src/components/SeatMap.jsx
import React from 'react';
import './SeatMap.css';

const SeatMap = ({ seats, selectedSeats, onSeatSelect }) => {
  // Группируем места по рядам
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.rowNumber]) {
      acc[seat.rowNumber] = [];
    }
    acc[seat.rowNumber].push(seat);
    return acc;
  }, {});

  // Сортируем ряды по номеру
  const sortedRows = Object.keys(groupedSeats)
    .map(Number)
    .sort((a, b) => a - b);

  const getSeatClass = (seat) => {
    let className = 'seat';
    
    if (!seat.free) {
      className += ' occupied';
    } else if (selectedSeats.includes(seat.id)) {
      className += ' selected';
    } else {
      className += ' free';
    }

    // Добавляем класс для уровня комфорта (если нужно)
    if (seat.comfortLevelId) {
      className += ` comfort-${seat.comfortLevelId}`;
    }

    return className;
  };

  const handleSeatClick = (seat) => {
    // Можно выбрать только свободные места
    if (seat.free) {
      onSeatSelect(seat.id);
    }
  };

  return (
    <div className="seat-map">
      {sortedRows.map(rowNumber => {
        const rowSeats = groupedSeats[rowNumber].sort((a, b) => a.seatNumber - b.seatNumber);
        
        return (
          <div key={rowNumber} className="seat-row">
            <div className="row-number">{rowNumber}</div>
            <div className="seats-container">
              {rowSeats.map(seat => (
                <div
                  key={seat.id}
                  className={getSeatClass(seat)}
                  onClick={() => handleSeatClick(seat)}
                  title={`Ряд ${seat.rowNumber}, место ${seat.seatNumber}${!seat.free ? ' (занято)' : ''}`}
                >
                  <span className="seat-number">{seat.seatNumber}</span>
                </div>
              ))}
            </div>
            <div className="row-number">{rowNumber}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SeatMap;