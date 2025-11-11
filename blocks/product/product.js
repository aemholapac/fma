export default function decorate(block) {
  const table = block.querySelector('table');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  if (rows.length < 2) return;

  const headerCells = rows[0].querySelectorAll('td');
  const valueCells = rows[1].querySelectorAll('td');

  valueCells.forEach((cell, index) => {
    const value = cell.textContent.trim();
    if (headerCells[index]) {
      if (value === '1') {
        headerCells[index].classList.add('available');
      } else if (value === '0') {
        headerCells[index].classList.add('unavailable');
      }
    }
  });

  // Layout: 3つ目のdiv(写真)を左側、4つ目以降を右側に配置
  const children = [...block.children];

  // 3つ目のdiv（index=2）に画像用クラスを追加
  if (children[2]) {
    children[2].classList.add('product-image');
  }

  // 4つ目以降のdivをラップするコンテナを作成
  if (children.length > 3) {
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('product-content');

    // 4つ目以降の要素をコンテナに移動
    children.slice(3).forEach((child, index) => {
      contentWrapper.appendChild(child);

      // 2番目の要素（発売日）の処理
      if (index === 1) {
        child.classList.add('release-date');

        // 日付フォーマットを変換（YYYY-MM-DD または YYYY/MM/DD → YYYY年MM月DD日）
        const dateText = child.textContent.trim();
        const dateMatch = dateText.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
        if (dateMatch) {
          const [, year, month, day] = dateMatch;
          child.textContent = `発売日：${year}年${month}月${day}日`;
        }
      }

      // 3番目の要素（価格）の処理
      if (index === 2) {
        child.classList.add('product-price');

        // 価格を取得して消費税込みの金額を計算
        const priceText = child.textContent.trim();
        const priceMatch = priceText.match(/(\d+)/);
        if (priceMatch) {
          const price = parseInt(priceMatch[1], 10);
          const taxIncludedPrice = Math.floor(price * 1.1); // 消費税10%
          child.textContent = `${price.toLocaleString()}円（税込${taxIncludedPrice.toLocaleString()}円）`;
        }
      }
    });

    block.appendChild(contentWrapper);
  }
}
