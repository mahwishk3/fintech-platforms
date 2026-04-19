interface ReturnDisplayProps {
  value: number;
  showTrend?: boolean;
  large?: boolean;
}

export default function ReturnDisplay({ value, showTrend = false, large = false }: ReturnDisplayProps) {
  return (
    <span className={`return-display${large ? ' large' : ''}`} data-testid="display-return">
      {showTrend && <span style={{ fontSize: large ? '20px' : '13px' }}>↑</span>}
      {value.toFixed(2)}%
    </span>
  );
}
