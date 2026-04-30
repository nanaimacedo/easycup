import { NextRequest, NextResponse } from 'next/server';
import { extrairDados } from '@/lib/extractor';

// POST /api/importar - upload de PDF ou imagem para extração
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-admin-session');
  if (authHeader !== 'authenticated') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'Arquivo muito grande (máximo 10MB)' }, { status: 400 });
  }

  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de arquivo não suportado. Use PDF, PNG ou JPEG.' }, { status: 400 });
  }

  try {
    let textoExtraido = '';

    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const textParts: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textParts.push(content.items.map((item: any) => item.str).join(' '));
      }
      textoExtraido = textParts.join('\n');
    } else {
      // Imagem - OCR com Tesseract.js
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('por');
      const buffer = Buffer.from(await file.arrayBuffer());
      const { data } = await worker.recognize(buffer);
      textoExtraido = data.text;
      await worker.terminate();
    }

    if (!textoExtraido || textoExtraido.trim().length < 10) {
      return NextResponse.json({
        error: 'Não foi possível extrair texto do arquivo. Tente um PDF com texto selecionável ou uma imagem mais nítida.',
      }, { status: 422 });
    }

    const dadosExtraidos = extrairDados(textoExtraido);

    return NextResponse.json({
      data: dadosExtraidos,
      arquivo: {
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
      },
    });
  } catch (err) {
    console.error('Erro na extração:', err);
    return NextResponse.json({ error: 'Erro ao processar o arquivo' }, { status: 500 });
  }
}
