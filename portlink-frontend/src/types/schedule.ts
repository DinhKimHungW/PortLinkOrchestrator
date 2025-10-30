export interface ScheduleWindow {
  start: string;
  end: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  window?: ScheduleWindow;
  status?: 'planned' | 'in_progress' | 'completed';
}
