'use client';

import { Shield, Eye, Trash2, Lock, FileText } from 'lucide-react';

interface LgpdModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function LgpdModal({ onAccept, onDecline }: LgpdModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Política de Privacidade - LGPD</h2>
              <p className="text-blue-100 text-sm">Lei Geral de Proteção de Dados (Lei 13.709/2018)</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            O <strong>Coopercotia Atlético Clube</strong>, em conformidade com a Lei Geral de Proteção de Dados
            Pessoais (LGPD - Lei nº 13.709/2018), informa que os dados pessoais coletados neste formulário
            de inscrição serão utilizados exclusivamente para as finalidades descritas abaixo.
          </p>

          <div className="space-y-4">
            <LgpdItem
              icon={<FileText className="w-5 h-5" />}
              title="Finalidade da Coleta"
              description="Seus dados serão utilizados exclusivamente para: organização e gestão do 78º Campeonato Intercolonial de Tênis, comunicação sobre cronogramas, resultados e atualizações do torneio, e emissão de recibos de inscrição."
            />
            <LgpdItem
              icon={<Lock className="w-5 h-5" />}
              title="Base Legal"
              description="O tratamento dos seus dados pessoais é realizado com base no seu consentimento (Art. 7º, I da LGPD) e na execução de contrato/procedimento preliminar (Art. 7º, V da LGPD)."
            />
            <LgpdItem
              icon={<Eye className="w-5 h-5" />}
              title="Compartilhamento"
              description="Seus dados não serão compartilhados com terceiros, exceto quando necessário para a organização do evento (árbitros, federações esportivas) ou por obrigação legal."
            />
            <LgpdItem
              icon={<Trash2 className="w-5 h-5" />}
              title="Retenção e Exclusão"
              description="Os dados serão mantidos pelo período necessário à organização do campeonato e cumprimento de obrigações legais. Você pode solicitar a exclusão dos seus dados a qualquer momento pelos canais de contato do clube."
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 text-sm mb-1">Seus Direitos (Art. 18 da LGPD)</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>- Confirmação da existência de tratamento dos seus dados</li>
              <li>- Acesso, correção e portabilidade dos seus dados</li>
              <li>- Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>- Revogação do consentimento a qualquer momento</li>
              <li>- Informação sobre compartilhamento com entidades públicas e privadas</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 text-sm mb-1">Uso de Imagem (Art. 7º, I)</h4>
            <p className="text-xs text-blue-700">
              Ao participar do campeonato, você poderá autorizar opcionalmente o uso da sua imagem
              para fins de divulgação do evento por fotos, vídeos e entrevistas em qualquer meio de
              comunicação, sem geração de ônus para o Coopercotia Atlético Clube.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-[var(--color-text)] text-sm mb-1">Canal de Contato - DPO</h4>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento dos seus dados:
            </p>
            <p className="text-xs text-[var(--color-text)] mt-1">
              E-mail: coopertenis@uol.com.br | Tel: (11) 3782-0727 | WhatsApp: (11) 99967-7021
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDecline}
            className="flex-1 px-6 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            Não Concordo
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Li e Concordo com a Política de Privacidade
          </button>
        </div>
      </div>
    </div>
  );
}

function LgpdItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-[var(--color-primary)]">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-sm text-[var(--color-text)]">{title}</h4>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}
