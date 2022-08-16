import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.css';

interface WaveProps {
  message: string;
  publishedAt: Date;
  address: string;
}

export const Wave = ({ message, address, publishedAt }: WaveProps) => {
  const publishedDateFormatted = format(
    publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    {
      locale: ptBR,
    }
  );

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  return (
    <div className={styles.comment}>
      <header>
        <div className={styles.authorAndTime}>
          <strong>{address}</strong>

          <time
            title={publishedDateFormatted}
            dateTime={publishedAt.toLocaleDateString()}
          >
            {publishedDateRelativeToNow}
          </time>
        </div>
      </header>

      <p>{message}</p>
    </div>
  );
};
