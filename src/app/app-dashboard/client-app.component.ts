import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClientAuthService, ClientInfo } from '../core/services/client-auth.service';
import { SeoService } from '../core/services/seo.service';
import { environment } from '../../environments/environment';

interface ReferralStats {
  code: string;
  totalReferred: number;
  creditMonths: number;
}

type Tab = 'overview' | 'posts' | 'referrals' | 'plan';

@Component({
  selector: 'app-client-app',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="app-shell" *ngIf="client">
      <aside class="app-sidebar">
        <a routerLink="/" class="app-logo">
          <img src="assets/images/logo-akroma-horizontal.png" alt="Akroma" />
        </a>

        <nav class="app-nav">
          <button type="button" class="app-nav__item" [class.app-nav__item--active]="tab === 'overview'" (click)="tab = 'overview'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Inicio</span>
          </button>
          <button type="button" class="app-nav__item" [class.app-nav__item--active]="tab === 'posts'" (click)="tab = 'posts'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            <span>Posts</span>
          </button>
          <button type="button" class="app-nav__item" [class.app-nav__item--active]="tab === 'referrals'" (click)="tab = 'referrals'; loadReferralStats()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Indicacoes</span>
          </button>
          <button type="button" class="app-nav__item" [class.app-nav__item--active]="tab === 'plan'" (click)="tab = 'plan'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span>Plano</span>
          </button>
        </nav>

        <div class="app-sidebar__footer">
          <button type="button" class="app-logout" (click)="logout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sair
          </button>
        </div>
      </aside>

      <main class="app-main">
        <!-- Welcome banner (first time) -->
        <div class="app-welcome" *ngIf="showWelcome">
          <div class="app-welcome__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div>
            <strong>Bem-vindo ao Akroma Spark, {{ client.name.split(' ')[0] }}!</strong>
            <span>Seu trial PRO de 7 dias esta ativo. Conecte seu Instagram para comecar.</span>
          </div>
          <button type="button" class="app-welcome__close" (click)="showWelcome = false" aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- OVERVIEW -->
        <div *ngIf="tab === 'overview'">
          <header class="app-page-header">
            <h1>Ola, {{ client.name.split(' ')[0] }}</h1>
            <p>Este e o seu painel do Akroma Spark.</p>
          </header>

          <div class="app-stats">
            <div class="app-stat" *ngIf="trialDaysLeft !== null">
              <span class="app-stat__label">Trial</span>
              <span class="app-stat__value">{{ trialDaysLeft }} {{ trialDaysLeft === 1 ? 'dia' : 'dias' }}</span>
              <span class="app-stat__hint">Restantes</span>
            </div>
            <div class="app-stat">
              <span class="app-stat__label">Plano atual</span>
              <span class="app-stat__value">{{ client.planTier }}</span>
              <span class="app-stat__hint">{{ trialActive ? 'Em teste gratis' : 'Ativo' }}</span>
            </div>
            <div class="app-stat">
              <span class="app-stat__label">Codigo</span>
              <span class="app-stat__value app-stat__value--mono">{{ client.referralCode || '—' }}</span>
              <span class="app-stat__hint">Seu codigo de indicacao</span>
            </div>
          </div>

          <div class="app-actions">
            <div class="app-action app-action--primary">
              <h3>Conecte seu Instagram</h3>
              <p>Para a IA publicar, precisamos da autorizacao do Instagram. Isso leva 1 minuto.</p>
              <button type="button" class="btn btn--spark" (click)="connectInstagram()">
                Conectar Instagram &rarr;
              </button>
            </div>
            <div class="app-action">
              <h3>Configure seu nicho</h3>
              <p>A IA adapta os posts ao seu mercado. Escolha seu nicho para melhores resultados.</p>
              <button type="button" class="btn btn--outline" disabled>Em breve</button>
            </div>
            <div class="app-action">
              <h3>Indique e ganhe</h3>
              <p>Cada amigo que assinar usando seu codigo te da 1 mes gratis. Sem limite.</p>
              <button type="button" class="btn btn--outline" (click)="tab = 'referrals'; loadReferralStats()">
                Ver meu codigo
              </button>
            </div>
          </div>
        </div>

        <!-- POSTS -->
        <div *ngIf="tab === 'posts'">
          <header class="app-page-header">
            <h1>Seus posts</h1>
            <p>Aprove, edite ou reagende os posts gerados pela IA.</p>
          </header>
          <div class="app-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            <h3>Nenhum post ainda</h3>
            <p>Conecte seu Instagram para a IA comecar a gerar posts automaticamente.</p>
            <button type="button" class="btn btn--spark" (click)="tab = 'overview'">Ir para o inicio</button>
          </div>
        </div>

        <!-- REFERRALS -->
        <div *ngIf="tab === 'referrals'">
          <header class="app-page-header">
            <h1>Programa de indicacao</h1>
            <p>Cada amigo que assinar o Spark com seu codigo, voce ganha 1 mes gratis.</p>
          </header>

          <div class="app-referral-card">
            <span class="app-referral-card__label">SEU CODIGO</span>
            <div class="app-referral-card__code">
              <strong>{{ referralStats?.code || client.referralCode || '—' }}</strong>
              <button type="button" class="app-copy-btn" (click)="copyCode()">
                <svg *ngIf="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <svg *ngIf="copied" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{{ copied ? 'Copiado!' : 'Copiar' }}</span>
              </button>
            </div>
            <div class="app-referral-card__share">
              <span>Compartilhe: <code>spark.akroma.com.br/cadastro?ref={{ referralStats?.code || client.referralCode }}</code></span>
            </div>
          </div>

          <div class="app-stats">
            <div class="app-stat">
              <span class="app-stat__label">Indicados</span>
              <span class="app-stat__value">{{ referralStats?.totalReferred ?? 0 }}</span>
              <span class="app-stat__hint">Amigos que assinaram</span>
            </div>
            <div class="app-stat">
              <span class="app-stat__label">Credito</span>
              <span class="app-stat__value">{{ referralStats?.creditMonths ?? 0 }}</span>
              <span class="app-stat__hint">{{ (referralStats?.creditMonths ?? 0) === 1 ? 'mes gratis' : 'meses gratis' }}</span>
            </div>
          </div>
        </div>

        <!-- PLAN -->
        <div *ngIf="tab === 'plan'">
          <header class="app-page-header">
            <h1>Seu plano</h1>
            <p>Gerencie seu plano e cobrancas.</p>
          </header>

          <div class="app-plan-card">
            <div class="app-plan-card__header">
              <div>
                <span class="app-plan-card__tag">PLANO ATUAL</span>
                <strong>{{ client.planTier }}</strong>
                <span class="app-plan-card__status" *ngIf="trialActive">Trial gratis — {{ trialDaysLeft }} dias restantes</span>
              </div>
            </div>
            <p class="app-plan-card__desc">
              Apos o trial, o plano {{ client.planTier }} custa a partir de R$ 497/mes (anual).
              Voce pode mudar de plano ou cancelar a qualquer momento.
            </p>
            <div class="app-plan-card__ctas">
              <a routerLink="/spark" fragment="pricing" class="btn btn--outline">Ver planos</a>
              <a routerLink="/contato" class="btn btn--spark">Falar com a equipe</a>
            </div>
          </div>
        </div>
      </main>
    </section>
  `,
  styles: [`
    :host { display: block; background: #050912; min-height: 100vh; }

    .app-shell {
      display: grid; grid-template-columns: 240px 1fr; min-height: 100vh;
    }
    @media (max-width: 768px) {
      .app-shell { grid-template-columns: 1fr; }
      .app-sidebar { display: none; }
    }

    .app-sidebar {
      background: #07091a; border-right: 1px solid rgba(255,255,255,0.05);
      padding: 24px 16px; display: flex; flex-direction: column; gap: 24px;
    }
    .app-logo { display: inline-block; padding: 0 8px; }
    .app-logo img { height: 26px; }
    .app-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    .app-nav__item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px; border-radius: 8px;
      background: transparent; color: #9ca3af; border: none; cursor: pointer;
      font-size: 14px; font-weight: 500; text-align: left;
      transition: all 0.15s;
    }
    .app-nav__item svg { width: 16px; height: 16px; flex-shrink: 0; }
    .app-nav__item:hover { background: rgba(255,255,255,0.04); color: #fff; }
    .app-nav__item--active {
      background: rgba(251,191,36,0.08); color: #fbbf24;
    }

    .app-sidebar__footer { padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); }
    .app-logout {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 10px 14px; border-radius: 8px;
      background: transparent; color: #9ca3af; border: none; cursor: pointer;
      font-size: 13px; font-weight: 500; text-align: left;
      transition: all 0.15s;
    }
    .app-logout:hover { background: rgba(239,68,68,0.08); color: #f87171; }
    .app-logout svg { width: 14px; height: 14px; }

    .app-main { padding: 32px 40px; max-width: 1100px; }
    @media (max-width: 768px) { .app-main { padding: 24px 16px; } }

    .app-welcome {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 20px; margin-bottom: 32px; border-radius: 14px;
      background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.2);
    }
    .app-welcome__icon { flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px;
      background: rgba(251,191,36,0.12); display: flex; align-items: center; justify-content: center; }
    .app-welcome__icon svg { width: 18px; height: 18px; }
    .app-welcome > div:nth-child(2) { flex: 1; }
    .app-welcome strong { display: block; color: #fff; font-size: 15px; margin-bottom: 2px; }
    .app-welcome span { font-size: 13px; color: #d1d5db; }
    .app-welcome__close {
      background: transparent; border: none; cursor: pointer; color: #6b7280;
      padding: 6px; border-radius: 6px; transition: all 0.15s;
    }
    .app-welcome__close:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .app-welcome__close svg { width: 16px; height: 16px; }

    .app-page-header { margin-bottom: 28px; }
    .app-page-header h1 {
      font-size: clamp(24px, 3vw, 30px); font-weight: 800; color: #fff; margin: 0 0 6px;
    }
    .app-page-header p { font-size: 14px; color: #9ca3af; margin: 0; }

    .app-stats {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;
    }
    @media (max-width: 640px) { .app-stats { grid-template-columns: 1fr; } }
    .app-stat {
      padding: 20px; border-radius: 14px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    }
    .app-stat__label {
      display: block; font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
      color: #6b7280; text-transform: uppercase; margin-bottom: 8px;
    }
    .app-stat__value {
      display: block; font-size: 28px; font-weight: 800; color: #fbbf24; line-height: 1;
      margin-bottom: 4px;
    }
    .app-stat__value--mono { font-family: 'SF Mono', Menlo, monospace; font-size: 22px; letter-spacing: 1px; }
    .app-stat__hint { font-size: 12px; color: #9ca3af; }

    .app-actions {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    }
    @media (max-width: 860px) { .app-actions { grid-template-columns: 1fr; } }
    .app-action {
      padding: 24px; border-radius: 14px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    }
    .app-action--primary {
      background: rgba(251,191,36,0.05); border-color: rgba(251,191,36,0.2);
    }
    .app-action h3 { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 6px; }
    .app-action p { font-size: 13px; color: #9ca3af; line-height: 1.6; margin: 0 0 16px; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 10px 18px; border-radius: 10px; font-weight: 600; font-size: 14px;
      border: none; cursor: pointer; text-decoration: none;
      transition: all 0.2s;
    }
    .btn--spark {
      background: linear-gradient(135deg, #f59e0b, #d97706); color: #000;
      border: 1px solid rgba(251,191,36,0.4);
    }
    .btn--spark:hover:not(:disabled) {
      filter: brightness(1.08); transform: translateY(-1px);
    }
    .btn--spark:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn--outline {
      background: transparent; color: #d1d5db;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .btn--outline:hover:not(:disabled) { border-color: rgba(255,255,255,0.3); color: #fff; }
    .btn--outline:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Empty */
    .app-empty {
      text-align: center; padding: 64px 24px; border-radius: 14px;
      background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.08);
    }
    .app-empty svg { width: 42px; height: 42px; color: #4b5563; margin-bottom: 16px; }
    .app-empty h3 { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 6px; }
    .app-empty p { font-size: 14px; color: #9ca3af; max-width: 360px; margin: 0 auto 20px; }

    /* Referral */
    .app-referral-card {
      padding: 24px; border-radius: 14px; margin-bottom: 24px;
      background: rgba(251,191,36,0.05); border: 1px solid rgba(251,191,36,0.2);
    }
    .app-referral-card__label {
      display: block; font-size: 11px; font-weight: 700; letter-spacing: 2px;
      color: #fbbf24; margin-bottom: 12px;
    }
    .app-referral-card__code {
      display: flex; align-items: center; gap: 16px;
      font-family: 'SF Mono', Menlo, monospace; margin-bottom: 12px;
    }
    .app-referral-card__code strong {
      font-size: 32px; font-weight: 800; color: #fff; letter-spacing: 3px;
    }
    .app-copy-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 600;
      background: rgba(255,255,255,0.06); color: #d1d5db;
      border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
      transition: all 0.15s;
    }
    .app-copy-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .app-copy-btn svg { width: 13px; height: 13px; }
    .app-referral-card__share { font-size: 12px; color: #9ca3af; }
    .app-referral-card__share code {
      background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px;
      font-size: 12px; color: #fbbf24;
    }

    /* Plan */
    .app-plan-card {
      padding: 28px; border-radius: 14px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    }
    .app-plan-card__header { margin-bottom: 16px; }
    .app-plan-card__tag {
      display: block; font-size: 11px; font-weight: 700; letter-spacing: 2px;
      color: #6b7280; margin-bottom: 8px;
    }
    .app-plan-card__header strong {
      display: block; font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 6px;
    }
    .app-plan-card__status {
      display: inline-block; padding: 4px 12px; border-radius: 20px;
      background: rgba(34,197,94,0.1); color: #22c55e;
      font-size: 12px; font-weight: 600;
    }
    .app-plan-card__desc { font-size: 14px; color: #9ca3af; line-height: 1.6; margin: 0 0 20px; }
    .app-plan-card__ctas { display: flex; gap: 12px; flex-wrap: wrap; }
  `]
})
export class ClientAppComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(ClientAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  client: ClientInfo | null = null;
  tab: Tab = 'overview';
  showWelcome = false;
  copied = false;
  referralStats: ReferralStats | null = null;

  ngOnInit(): void {
    this.seo.setPage({ title: 'Painel — Akroma Spark', description: '', noindex: true });

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/entrar']);
      return;
    }

    this.client = this.auth.getClient();
    if (!this.client) {
      this.auth.logout();
      return;
    }

    this.showWelcome = this.route.snapshot.queryParamMap.get('welcome') === '1';
  }

  get trialActive(): boolean {
    if (!this.client?.trialEndsAt) return false;
    return new Date(this.client.trialEndsAt).getTime() > Date.now();
  }

  get trialDaysLeft(): number | null {
    if (!this.client?.trialEndsAt) return null;
    const ms = new Date(this.client.trialEndsAt).getTime() - Date.now();
    return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
  }

  loadReferralStats(): void {
    if (!this.client) return;
    if (this.referralStats) return; // cached
    this.http.get<ReferralStats>(`${environment.apiUrl}/api/v1/referral/stats/${this.client.clientId}`).subscribe({
      next: (stats) => this.referralStats = stats,
      error: () => {
        // Fallback to local info if endpoint fails
        if (this.client?.referralCode) {
          this.referralStats = { code: this.client.referralCode, totalReferred: 0, creditMonths: 0 };
        }
      }
    });
  }

  copyCode(): void {
    const code = this.referralStats?.code || this.client?.referralCode;
    if (!code) return;
    try {
      navigator.clipboard.writeText(code);
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    } catch {
      // noop
    }
  }

  connectInstagram(): void {
    // Placeholder until OAuth flow is wired up
    alert('Integracao com Instagram em breve. Em breve liberamos o fluxo de conexao automatica.');
  }

  logout(): void {
    this.auth.logout();
  }
}
