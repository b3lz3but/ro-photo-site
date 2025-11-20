export interface Image {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: boolean;
}

export interface Gallery {
  _path: string;
  title: string;
  description?: string;
  cover?: Image;
  images?: Image[];
  category?: string;
  date?: string;
  tags?: string[];
}

export interface Story {
  _path: string;
  title: string;
  description?: string;
  content: string;
  cover?: Image;
  date?: string;
  tags?: string[];
  author?: string;
}

export interface Testimonial {
  name: string;
  role?: string;
  content: string;
  avatar?: Image;
  rating?: number;
}

export interface Award {
  title?: string;
  year?: string;
  description?: string;
}
