import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackConversion } from "@/lib/tracking";
import { trackPixel } from "@/lib/meta-pixel";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const AVAILABLE_TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const WHATSAPP_NUMBER = "557183860639";

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  return compare < today;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function formatDateBR(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function CalendarPicker() {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);

  const firstDayOfWeek = daysInMonth[0].getDay();

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev.getMonth() >= today.getMonth() && prev.getFullYear() >= today.getFullYear()) {
      setCurrentMonth(prev);
    } else if (prev.getFullYear() > today.getFullYear()) {
      setCurrentMonth(prev);
    } else {
      // Don't go before current month
      const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      if (prev >= minMonth) {
        setCurrentMonth(prev);
      }
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  const handleDateClick = (date: Date) => {
    if (isPast(date) || isWeekend(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    const dateStr = formatDateBR(selectedDate);
    trackConversion('schedule', {
      date: dateStr,
      time: selectedTime,
      value: 0,
    });
    trackPixel('Schedule', { date: dateStr, time: selectedTime });
    const message = `Olá! Gostaria de confirmar minha sessão estratégica para ${dateStr} às ${selectedTime}. Vim pelo quiz de qualificação da NSM.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Calendar card */}
      <div className="rounded-2xl border border-white/[0.12] bg-white/[0.07] backdrop-blur-md px-5 py-5">
        {/* Header: month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            className={`p-2 rounded-lg transition-colors ${
              canGoPrev
                ? "text-white hover:bg-white/5"
                : "text-white/10 cursor-not-allowed"
            }`}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-white font-semibold font-body text-lg">
            {MONTH_NAMES[month]} {year}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-white/60 text-xs font-body font-medium py-1 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {daysInMonth.map((date) => {
            const past = isPast(date);
            const weekend = isWeekend(date);
            const disabled = past || weekend;
            const isToday = isSameDay(date, today);
            const isSelected =
              selectedDate !== null && isSameDay(date, selectedDate);

            let className =
              "w-full aspect-square flex items-center justify-center text-sm font-body rounded-lg transition-colors ";

            if (disabled) {
              className += "text-white/20 cursor-not-allowed";
            } else if (isSelected) {
              className +=
                "bg-nsm-green text-nsm-dark-1 font-semibold cursor-pointer";
            } else {
              className += "text-white hover:bg-nsm-green/10 cursor-pointer";
            }

            if (isToday && !isSelected) {
              className += " ring-1 ring-nsm-green/40";
            }

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={disabled}
                className={className}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="mt-5">
          <p className="text-white/70 text-base font-body mb-4 text-center">
            Horários disponíveis para{" "}
            <span className="text-white font-semibold">{formatDateBR(selectedDate)}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {AVAILABLE_TIMES.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeClick(time)}
                  className={`rounded-xl border backdrop-blur-md px-5 py-2.5 text-base font-body font-medium cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-nsm-green text-nsm-dark-1 border-nsm-green"
                      : "bg-white/[0.07] border-white/[0.12] text-white hover:border-nsm-green/50 hover:bg-white/[0.10]"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm button */}
      {selectedDate && selectedTime && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            className="btn-neon"
            onClick={handleConfirm}
          >
            Confirmar agendamento
          </button>
        </div>
      )}
    </div>
  );
}
