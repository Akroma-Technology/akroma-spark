import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SeoService } from '../core/services/seo.service';
import { SparkTopbarComponent } from '../shared/components/topbar/topbar.component';
import { SparkFooterComponent } from '../shared/components/footer/footer.component';

interface NicheInfo {
  value: string;
  label: string;
  title: string;
  subtitle: string;
  benefits: string[];
  stats: { num: string; label: string }[];
}

const NICHES: NicheInfo[] = [
  {
    value: 'fitness',
    label: 'Fitness / Academia',
    title: 'Automacao de Instagram para Academias e Personal Trainers',
    subtitle: 'Posts diarios com IA sobre treino, nutricao e motivacao — sem voce precisar criar nada.',
    benefits: [
      'Conteudo sobre exercicios, nutricao e lifestyle fitness gerado automaticamente',
      'Imagens profissionais de treino adaptadas ao estilo da sua marca',
      'Hashtags otimizadas para o nicho fitness (#treino #gym #saude)',
      'Posts nos melhores horarios para engajamento de alunos'
    ],
    stats: [
      { num: '+180%', label: 'Engajamento medio' },
      { num: '30', label: 'Posts/mes sem esforco' },
      { num: '2h/dia', label: 'Tempo economizado' }
    ]
  },
  {
    value: 'tecnologia',
    label: 'Tecnologia',
    title: 'Social Media com IA para Empresas de Tecnologia',
    subtitle: 'A IA pesquisa as ultimas tendencias tech e publica conteudo relevante todos os dias.',
    benefits: [
      'Acompanha tendencias de IA, cloud, dev e startups em tempo real',
      'Legendas tecnicas com linguagem acessivel para seu publico',
      'Carrosseis explicativos sobre conceitos complexos',
      'Hashtags otimizadas para tech (#tecnologia #inovacao #dev)'
    ],
    stats: [
      { num: '+210%', label: 'Alcance organico' },
      { num: '24/7', label: 'Monitoramento de trends' },
      { num: '98%', label: 'Taxa de publicacao' }
    ]
  },
  {
    value: 'gastronomia',
    label: 'Gastronomia',
    title: 'Automacao de Instagram para Restaurantes e Chefs',
    subtitle: 'Conteudo gourmet publicado diariamente — receitas, dicas e trends culinarias.',
    benefits: [
      'Posts sobre receitas, ingredientes da estacao e tecnicas culinarias',
      'Imagens apetitosas geradas por IA no estilo food photography',
      'Conteudo adaptado para delivery, restaurante ou chef pessoal',
      'Hashtags de gastronomia otimizadas por regiao'
    ],
    stats: [
      { num: '+165%', label: 'Engajamento em 60 dias' },
      { num: '12', label: 'Temas por semana' },
      { num: '3x', label: 'Mais salvamentos' }
    ]
  },
  {
    value: 'moda',
    label: 'Moda',
    title: 'Instagram no Piloto Automatico para Marcas de Moda',
    subtitle: 'Tendencias de moda, looks e styling publicados diariamente com IA.',
    benefits: [
      'Conteudo sobre tendencias, cores da temporada e styling tips',
      'Imagens de moda geradas com estetica profissional',
      'Carrosseis de looks e combinacoes automaticos',
      'Hashtags segmentadas por nicho (#moda #fashion #estilo)'
    ],
    stats: [
      { num: '+190%', label: 'Crescimento de seguidores' },
      { num: '7/7', label: 'Posts por semana' },
      { num: '4x', label: 'Mais interacoes' }
    ]
  },
  {
    value: 'juridico',
    label: 'Juridico',
    title: 'Marketing Juridico com IA — Posts Diarios para Advogados',
    subtitle: 'Conteudo informativo sobre direito publicado todo dia, respeitando a etica da OAB.',
    benefits: [
      'Posts sobre direitos do consumidor, trabalhista, tributario e mais',
      'Tom educativo e informativo (sem captacao direta)',
      'Carrosseis explicativos sobre leis e direitos',
      'Linguagem acessivel para leigos'
    ],
    stats: [
      { num: '+140%', label: 'Engajamento organico' },
      { num: '100%', label: 'Compliance OAB' },
      { num: '5x', label: 'Mais consultas via DM' }
    ]
  },
  {
    value: 'imobiliario',
    label: 'Imobiliario',
    title: 'Automacao de Instagram para Corretores de Imoveis',
    subtitle: 'Posts sobre mercado imobiliario, dicas de compra e investimento — todo dia, automatico.',
    benefits: [
      'Conteudo sobre mercado, financiamento, decoracao e investimento',
      'Imagens de imoveis e ambientes geradas por IA',
      'Posts educativos que atraem leads qualificados',
      'Hashtags geolocalizadas por cidade e bairro'
    ],
    stats: [
      { num: '2.3', label: 'Leads/semana em media' },
      { num: '+175%', label: 'Alcance organico' },
      { num: '40 dias', label: 'Para primeiro lead' }
    ]
  },
  {
    value: 'educacao',
    label: 'Educacao',
    title: 'Social Media com IA para Escolas e Cursos',
    subtitle: 'Conteudo educacional publicado diariamente — dicas de estudo, curiosidades e motivacao.',
    benefits: [
      'Posts sobre aprendizado, produtividade e curiosidades educacionais',
      'Carrosseis didaticos que simplificam conceitos complexos',
      'Conteudo adaptado para escola, faculdade ou curso online',
      'Hashtags de educacao otimizadas'
    ],
    stats: [
      { num: '+155%', label: 'Engajamento de alunos' },
      { num: '30', label: 'Posts educativos/mes' },
      { num: '2x', label: 'Mais matriculas' }
    ]
  },
  {
    value: 'saude',
    label: 'Saude',
    title: 'Automacao de Instagram para Clinicas e Profissionais de Saude',
    subtitle: 'Conteudo informativo sobre saude e bem-estar publicado todo dia com IA.',
    benefits: [
      'Posts sobre prevencao, saude mental, nutricao e qualidade de vida',
      'Tom profissional e acolhedor, sem promessas medicas',
      'Carrosseis educativos sobre condicoes e tratamentos',
      'Hashtags de saude segmentadas por especialidade'
    ],
    stats: [
      { num: '+160%', label: 'Engajamento em 90 dias' },
      { num: '3x', label: 'Mais agendamentos' },
      { num: '98%', label: 'Conteudo aprovado' }
    ]
  }
];

interface Plan {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  monthly: number;
  prefix?: string;
  featured: boolean;
  features: string[];
  ctaLabel: string;
  ctaRoute: string;
}

@Component({
  selector: 'app-spark',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SparkTopbarComponent, SparkFooterComponent],
  template: `
    <app-spark-topbar></app-spark-topbar>

    <!-- HERO -->
    <section class="spark-hero">
      <canvas #heroCanvas class="spark-hero__canvas" aria-hidden="true"></canvas>
      <div class="spark-hero__glow" aria-hidden="true"></div>
      <div class="container spark-hero__inner">
        <span class="label spark-hero__label">AKROMA SPARK</span>
        <h1 class="spark-hero__title">
          Social media no<br>
          <span class="spark-hero__title--accent">piloto automatico.</span>
        </h1>
        <p class="spark-hero__subtitle">
          IA que pesquisa tendencias, cria legendas, gera imagens e publica — todo dia, sem esforco.
          Instagram, Facebook e LinkedIn com engajamento real.
        </p>
        <div class="spark-hero__ctas">
          <a routerLink="/cadastro" class="btn btn--spark">Teste gratis 7 dias &rarr;</a>
          <a href="#demo" class="btn btn--outline">Ver demonstracao</a>
        </div>
        <p class="spark-hero__trial-note">Sem cartao de credito. Cancele quando quiser.</p>
      </div>
    </section>

    <!-- SOCIAL PROOF -->
    <section class="spark-proof">
      <div class="container">
        <div class="proof-grid">
          <div class="proof-item">
            <span class="proof-item__num">4.800+</span>
            <span class="proof-item__label">Posts publicados por IA</span>
          </div>
          <div class="proof-item">
            <span class="proof-item__num">32</span>
            <span class="proof-item__label">Clientes ativos</span>
          </div>
          <div class="proof-item">
            <span class="proof-item__num">+147%</span>
            <span class="proof-item__label">Engajamento medio</span>
          </div>
          <div class="proof-item">
            <span class="proof-item__num">98.2%</span>
            <span class="proof-item__label">Taxa de sucesso</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="spark-testimonials">
      <div class="container">
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <p class="testimonial-card__text">"Antes eu gastava 2h por dia criando posts. Com o Spark, acordo e ja esta publicado. Meu engajamento triplicou em 3 meses."</p>
            <div class="testimonial-card__author">
              <strong>Dra. Camila Rocha</strong>
              <span>Dermatologa — SP</span>
            </div>
          </div>
          <div class="testimonial-card">
            <p class="testimonial-card__text">"Contratei o Spark pra 3 imoveis e em 40 dias recebi 2 leads qualificados direto pelo Instagram. ROI absurdo."</p>
            <div class="testimonial-card__author">
              <strong>Rafael Mendes</strong>
              <span>Corretor de Imoveis — RJ</span>
            </div>
          </div>
          <div class="testimonial-card">
            <p class="testimonial-card__text">"O carrossel que a IA criou sobre leg press viralizou — 12k de alcance num perfil com 800 seguidores. Inacreditavel."</p>
            <div class="testimonial-card__author">
              <strong>Lucas Ferreira</strong>
              <span>Personal Trainer — BH</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DEMO -->
    <section id="demo" class="spark-demo">
      <div class="container">
        <span class="label">EXPERIMENTE AGORA</span>
        <h2 class="section-title">Veja o que o Spark criaria para voce</h2>
        <div class="demo-box">
          <div class="demo-box__input-row">
            <div class="demo-dropdown" [class.demo-dropdown--open]="demoDropdownOpen">
              <button type="button" class="demo-dropdown__trigger" (click)="demoDropdownOpen = !demoDropdownOpen">
                <span>{{ selectedNicheLabel }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <ul class="demo-dropdown__menu" *ngIf="demoDropdownOpen">
                <li *ngFor="let n of niches" (click)="selectNiche(n.value)"
                    [class.demo-dropdown__item--active]="demoNiche === n.value">
                  {{ n.label }}
                </li>
              </ul>
            </div>
            <button class="btn btn--spark" (click)="generateDemo()" [disabled]="demoLoading">
              {{ demoLoading ? 'Gerando...' : 'Gerar post de exemplo' }}
            </button>
          </div>
          <div class="demo-box__result" *ngIf="demoResult">
            <div class="demo-box__topic">{{ demoResult.topic }}</div>
            <div class="demo-box__caption">{{ demoResult.caption }}</div>
            <div class="demo-box__meta">
              <span class="demo-box__tag">Nicho: {{ demoResult.niche }}</span>
              <span class="demo-box__tag">100% gerado por IA</span>
            </div>
          </div>
          <div class="demo-box__result" *ngIf="demoError">
            <p style="color:#ef4444;">{{ demoError }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- COMO FUNCIONA -->
    <section id="como-funciona" class="spark-steps spark-section-target">
      <div class="container">
        <span class="label">COMO FUNCIONA</span>
        <h2 class="section-title">4 etapas. Zero esforco.</h2>
        <div class="steps-grid">
          <div class="step-card">
            <span class="step-card__num">01</span>
            <h3 class="step-card__title">Pesquisa de tendencias</h3>
            <p class="step-card__desc">A IA busca as noticias e trends mais relevantes do seu nicho nas ultimas 24-48h usando Google Search em tempo real.</p>
          </div>
          <div class="step-card">
            <span class="step-card__num">02</span>
            <h3 class="step-card__title">Geracao de conteudo</h3>
            <p class="step-card__desc">Com base nas tendencias, gera legendas provocativas com hooks de scroll-stop, hashtags otimizadas e CTA.</p>
          </div>
          <div class="step-card">
            <span class="step-card__num">03</span>
            <h3 class="step-card__title">Criacao visual</h3>
            <p class="step-card__desc">Gera imagens ou carrosseis completos com design profissional, adaptados ao estilo da sua marca.</p>
          </div>
          <div class="step-card">
            <span class="step-card__num">04</span>
            <h3 class="step-card__title">Publicacao automatica</h3>
            <p class="step-card__desc">Publica automaticamente no Instagram, Facebook e LinkedIn nos horarios ideais para engajamento.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="spark-features">
      <div class="container">
        <span class="label">RECURSOS</span>
        <h2 class="section-title">Tudo que voce precisa para crescer</h2>
        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </span>
            <h4 class="feature-item__title">Posts diarios com IA</h4>
            <p class="feature-item__desc">Conteudo original gerado por IA todos os dias, com tom personalizado para sua marca.</p>
          </div>
          <div class="feature-item">
            <span class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            </span>
            <h4 class="feature-item__title">Analytics de engajamento</h4>
            <p class="feature-item__desc">Score 0-100 por post, tracking de hashtags, melhores horarios e feedback loop automatico.</p>
          </div>
          <div class="feature-item">
            <span class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            </span>
            <h4 class="feature-item__title">Imagens e carrosseis</h4>
            <p class="feature-item__desc">Criacao visual com Gemini — single posts e carrosseis de ate 10 slides.</p>
          </div>
          <div class="feature-item">
            <span class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
            </span>
            <h4 class="feature-item__title">Agendamento inteligente</h4>
            <p class="feature-item__desc">Slots por dia da semana com temas personalizados. Publica no melhor horario.</p>
          </div>
          <div class="feature-item">
            <span class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </span>
            <h4 class="feature-item__title">Templates de nicho</h4>
            <p class="feature-item__desc">Configs pre-prontas para fitness, tech, gastronomia, juridico e muito mais.</p>
          </div>
          <div class="feature-item">
            <span class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.3"/></svg>
            </span>
            <h4 class="feature-item__title">Renovacao automatica</h4>
            <p class="feature-item__desc">Tokens do Instagram e Facebook renovados automaticamente. Zero manutencao.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- NICHES -->
    <section class="spark-niches">
      <div class="container">
        <span class="label">SOLUCOES POR NICHO</span>
        <h2 class="section-title">Feito para o seu mercado</h2>
        <div class="niches-grid">
          <button *ngFor="let n of niches" type="button"
                  class="niche-card"
                  [class.niche-card--active]="expandedNiche === n.value"
                  (click)="toggleNiche(n.value)">
            {{ n.label }}
          </button>
        </div>

        <div class="niche-detail" *ngIf="activeNiche">
          <div class="niche-detail__header">
            <div>
              <h3 class="niche-detail__title">{{ activeNiche.title }}</h3>
              <p class="niche-detail__subtitle">{{ activeNiche.subtitle }}</p>
            </div>
            <button type="button" class="niche-detail__close" (click)="expandedNiche = null" aria-label="Fechar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="niche-detail__stats">
            <div class="niche-detail__stat" *ngFor="let s of activeNiche.stats">
              <span class="niche-detail__stat-num">{{ s.num }}</span>
              <span class="niche-detail__stat-label">{{ s.label }}</span>
            </div>
          </div>
          <ul class="niche-detail__benefits">
            <li *ngFor="let b of activeNiche.benefits">{{ b }}</li>
          </ul>
          <a routerLink="/cadastro" [queryParams]="{ niche: activeNiche.value }" class="btn btn--spark">
            Comecar teste gratis no nicho {{ activeNiche.label }} &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section id="planos" class="spark-pricing spark-section-target">
      <div class="container">
        <span class="label">PLANOS</span>
        <h2 class="section-title">Simples e transparente</h2>

        <!-- Billing toggle -->
        <div class="billing-toggle">
          <span [class.active]="!annual">Mensal</span>
          <button class="billing-toggle__switch" [class.annual]="annual" (click)="annual = !annual" aria-label="Alternar cobranca anual">
            <span class="billing-toggle__knob"></span>
          </button>
          <span [class.active]="annual">Anual <span class="billing-toggle__save">2 meses gratis</span></span>
        </div>

        <div class="pricing-grid">
          <div class="pricing-card" *ngFor="let p of plans"
               [class.pricing-card--featured]="p.featured">
            <span class="pricing-card__badge" *ngIf="p.featured">POPULAR</span>
            <div class="pricing-card__head">
              <span class="pricing-card__name">{{ p.name }}</span>
              <div class="pricing-card__price">
                <span class="pricing-card__currency">R$</span>
                <span class="pricing-card__amount">{{ annual ? annualPerMonth(p.monthly) : p.monthly }}</span>
                <span class="pricing-card__period">/mes</span>
              </div>
              <div class="pricing-card__annual-note" *ngIf="annual">
                R$ {{ p.monthly * 10 | number:'1.0-0':'pt-BR' }}/ano (pague 10, leve 12)
              </div>
              <div class="pricing-card__prefix" *ngIf="p.prefix">{{ p.prefix }}</div>
            </div>
            <ul class="pricing-card__features">
              <li *ngFor="let f of p.features">{{ f }}</li>
            </ul>
            <a [routerLink]="p.ctaRoute"
               [queryParams]="p.ctaRoute === '/cadastro' ? { plan: p.id, billing: annual ? 'annual' : 'monthly' } : null"
               class="btn btn--full pricing-card__cta"
               [class.btn--spark]="p.featured"
               [class.btn--outline]="!p.featured">
              {{ p.ctaLabel }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- REFERRAL -->
    <section class="spark-referral">
      <div class="container spark-referral__inner">
        <span class="label">PROGRAMA DE INDICACAO</span>
        <h2 class="section-title">Indique 4 amigos, ganhe 1 mes gratis</h2>
        <p class="spark-referral__desc">
          A cada 4 amigos que assinarem o Spark usando seu codigo, voce ganha 1 mes inteiro de credito.
          Sem limite de indicacoes — 8 amigos, 2 meses; 12 amigos, 3 meses; e por ai vai.
        </p>
        <div class="spark-referral__how">
          <div class="spark-referral__step">
            <span class="spark-referral__step-num">1</span>
            <span>Crie sua conta e receba seu codigo</span>
          </div>
          <div class="spark-referral__step">
            <span class="spark-referral__step-num">2</span>
            <span>Compartilhe com amigos</span>
          </div>
          <div class="spark-referral__step">
            <span class="spark-referral__step-num">3</span>
            <span>A cada 4 indicados, 1 mes gratis na sua conta</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="spark-cta">
      <div class="container spark-cta__inner">
        <h2 class="spark-cta__title">Pronto para automatizar seu social media?</h2>
        <p class="spark-cta__desc">Trial PRO de 7 dias gratis. Sem cartao. Sem compromisso.</p>
        <a routerLink="/cadastro" class="btn btn--spark btn--lg">Comecar agora &rarr;</a>
      </div>
    </section>

    <app-spark-footer></app-spark-footer>
  `,
  styles: [`
    :host { display: block; }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .label {
      font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
      color: #fbbf24; display: block; margin-bottom: 12px;
    }
    .section-title {
      font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: #fff;
      line-height: 1.15; margin-bottom: 48px;
    }

    /* Hero */
    .spark-hero {
      position: relative; padding: 200px 0 100px; overflow: hidden;
      min-height: 100vh;
      background: linear-gradient(180deg, #080c1a 0%, #0a0a12 50%, #0a0a12 100%);
      display: flex; align-items: center;
    }
    /* Particles live in the RIGHT half on desktop — mirroring akroma.com.br hero. */
    .spark-hero__canvas {
      position: absolute; top: 0; right: 0;
      width: 50%; height: 100%;
      pointer-events: none; z-index: 0;
      @media (max-width: 768px) {
        width: 100%; opacity: 0.35;
      }
    }
    .spark-hero__glow {
      position: absolute; top: -200px; right: 0;
      width: 800px; height: 800px; border-radius: 50%;
      background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%);
      pointer-events: none; z-index: 0;
    }
    .spark-hero__glow::after {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle, rgba(77,124,255,0.04) 0%, transparent 60%);
    }
    .spark-hero__inner {
      position: relative; z-index: 1;
      max-width: 600px;
      text-align: left;
    }
    @media (min-width: 769px) {
      .spark-hero__inner {
        /* Keep text in the left half so the sphere fills the right half. */
        margin-left: max(24px, calc((100vw - 1200px) / 2));
        margin-right: auto;
      }
    }
    @media (max-width: 768px) {
      .spark-hero__inner { text-align: center; margin: 0 auto; }
    }
    .spark-hero__label { margin-bottom: 20px; }
    .spark-hero__title {
      font-size: clamp(36px, 5vw, 64px); font-weight: 900; color: #fff;
      line-height: 1.05; margin-bottom: 24px;
    }
    .spark-hero__title--accent {
      background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .spark-hero__subtitle {
      font-size: 18px; color: #9ca3af; line-height: 1.7; margin-bottom: 36px;
      max-width: 520px;
    }
    .spark-hero__ctas { display: flex; gap: 16px; flex-wrap: wrap; }
    @media (max-width: 768px) {
      .spark-hero__subtitle { margin-left: auto; margin-right: auto; }
      .spark-hero__ctas { justify-content: center; }
    }
    .spark-hero__trial-note {
      margin-top: 16px; font-size: 13px; color: #6b7280;
    }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 15px;
      text-decoration: none; transition: all 0.2s; border: none; cursor: pointer;
    }
    .btn--spark {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #000; border: 1px solid rgba(251,191,36,0.4);
      box-shadow: 0 4px 16px -4px rgba(245,158,11,0.3);
    }
    .btn--spark:hover {
      filter: brightness(1.08); transform: translateY(-1px);
      box-shadow: 0 8px 24px -6px rgba(245,158,11,0.4);
    }
    .btn--spark:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .btn--outline {
      background: transparent; color: #d1d5db;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .btn--outline:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
    .btn--full { width: 100%; }
    .btn--lg { padding: 18px 36px; font-size: 17px; }

    /* Social Proof */
    .spark-proof {
      padding: 48px 0; background: #0a0a12;
      border-top: 1px solid rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .proof-grid { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; }
    .proof-item { text-align: center; }
    .proof-item__num {
      display: block; font-size: 36px; font-weight: 900; color: #fbbf24;
    }
    .proof-item__label { font-size: 13px; color: #6b7280; }

    /* Testimonials */
    .spark-testimonials { padding: 80px 0; background: #0a0a12; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .testimonial-card {
      padding: 28px; border-radius: 16px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    }
    .testimonial-card__text {
      font-size: 14px; color: #d1d5db; line-height: 1.7; font-style: italic;
      margin-bottom: 16px;
    }
    .testimonial-card__author strong { display: block; color: #fff; font-size: 14px; }
    .testimonial-card__author span { font-size: 12px; color: #6b7280; }

    /* Demo */
    .spark-demo {
      padding: 100px 0;
      background: linear-gradient(180deg, #0a0a12 0%, #0d0b1e 50%, #0a0a12 100%);
    }
    .demo-box {
      max-width: 680px; margin: 0 auto; padding: 32px; border-radius: 20px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    }
    .demo-box__input-row { display: flex; gap: 12px; margin-bottom: 20px; position: relative; }

    /* Custom dropdown — dark theme, no native select quirks */
    .demo-dropdown { flex: 1; position: relative; }
    .demo-dropdown__trigger {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border-radius: 10px; font-size: 15px; font-weight: 500;
      background: rgba(255,255,255,0.06); color: #fff;
      border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    .demo-dropdown__trigger:hover { border-color: rgba(251,191,36,0.4); background: rgba(255,255,255,0.08); }
    .demo-dropdown__trigger svg {
      width: 16px; height: 16px; color: #9ca3af;
      transition: transform 0.2s;
    }
    .demo-dropdown--open .demo-dropdown__trigger svg { transform: rotate(180deg); }
    .demo-dropdown__menu {
      position: absolute; top: calc(100% + 6px); left: 0; right: 0;
      list-style: none; padding: 6px; margin: 0;
      background: #111422; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; z-index: 20;
      max-height: 300px; overflow-y: auto;
      box-shadow: 0 12px 32px -8px rgba(0,0,0,0.6);
    }
    .demo-dropdown__menu li {
      padding: 10px 14px; border-radius: 8px; font-size: 14px; color: #d1d5db;
      cursor: pointer; transition: background 0.12s, color 0.12s;
    }
    .demo-dropdown__menu li:hover { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .demo-dropdown__item--active { background: rgba(251,191,36,0.08); color: #fbbf24; font-weight: 600; }
    .demo-box__result { margin-top: 16px; }
    .demo-box__topic {
      font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #fbbf24;
      text-transform: uppercase; margin-bottom: 12px;
    }
    .demo-box__caption {
      font-size: 15px; color: #d1d5db; line-height: 1.7; white-space: pre-wrap;
    }
    .demo-box__meta { display: flex; gap: 8px; margin-top: 16px; }
    .demo-box__tag {
      font-size: 11px; color: #9ca3af; background: rgba(255,255,255,0.05);
      padding: 4px 10px; border-radius: 6px;
    }

    /* Steps */
    .spark-steps { padding: 100px 0; background: #0a0a12; }
    .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .step-card {
      padding: 32px 24px; border-radius: 16px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      transition: border-color 0.2s;
    }
    .step-card:hover { border-color: rgba(251,191,36,0.25); }
    .step-card__num {
      font-size: 36px; font-weight: 900; color: rgba(251,191,36,0.2); display: block; margin-bottom: 16px;
    }
    .step-card__title { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 10px; }
    .step-card__desc { font-size: 14px; color: #9ca3af; line-height: 1.6; }

    /* Features */
    .spark-features {
      padding: 100px 0;
      background: linear-gradient(180deg, #0a0a12 0%, #0d0b1e 100%);
    }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .feature-item {
      padding: 28px; border-radius: 16px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    }
    .feature-item__icon {
      display: flex; align-items: center; justify-content: center;
      width: 48px; height: 48px; border-radius: 12px; margin-bottom: 16px;
      background: rgba(251,191,36,0.1); color: #fbbf24;
    }
    .feature-item__icon svg { width: 24px; height: 24px; }
    .feature-item__title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px; }
    .feature-item__desc { font-size: 14px; color: #9ca3af; line-height: 1.6; }

    /* Niches */
    .spark-niches { padding: 80px 0; background: #0a0a12; }
    .niches-grid { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
    .niche-card {
      padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600;
      color: #d1d5db; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      cursor: pointer; font-family: inherit; transition: all 0.18s;
    }
    .niche-card:hover { border-color: rgba(251,191,36,0.3); color: #fbbf24; }
    .niche-card--active {
      background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.4); color: #fbbf24;
    }

    /* Niche detail panel (accordion) */
    .niche-detail {
      margin: 40px auto 0; max-width: 760px; padding: 32px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(251,191,36,0.2);
      border-radius: 20px;
      animation: niche-expand 0.25s ease-out;
    }
    @keyframes niche-expand {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .niche-detail__header {
      display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
      margin-bottom: 24px;
    }
    .niche-detail__title {
      font-size: clamp(20px, 2.5vw, 26px); font-weight: 800; color: #fff;
      line-height: 1.2; margin: 0 0 8px;
    }
    .niche-detail__subtitle {
      font-size: 15px; color: #9ca3af; line-height: 1.6; margin: 0;
    }
    .niche-detail__close {
      flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
      color: #9ca3af; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .niche-detail__close:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .niche-detail__close svg { width: 16px; height: 16px; }
    .niche-detail__stats {
      display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap;
      padding: 20px; background: rgba(0,0,0,0.2); border-radius: 12px;
    }
    .niche-detail__stat { flex: 1; min-width: 140px; }
    .niche-detail__stat-num {
      display: block; font-size: 28px; font-weight: 900; color: #fbbf24;
      margin-bottom: 2px;
    }
    .niche-detail__stat-label { font-size: 12px; color: #6b7280; }
    .niche-detail__benefits {
      list-style: none; padding: 0; margin: 0 0 28px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .niche-detail__benefits li {
      font-size: 14px; color: #d1d5db; line-height: 1.6;
      padding-left: 22px; position: relative;
    }
    .niche-detail__benefits li::before {
      content: '\\2713'; position: absolute; left: 0; top: 0;
      color: #fbbf24; font-weight: 700;
    }

    /* Pricing */
    .spark-pricing { padding: 100px 0; background: #0a0a12; }
    .billing-toggle {
      display: flex; align-items: center; justify-content: center; gap: 12px;
      margin-bottom: 40px; font-size: 15px; color: #6b7280;
    }
    .billing-toggle span.active { color: #fff; font-weight: 600; }
    .billing-toggle__switch {
      width: 52px; height: 28px; border-radius: 14px; padding: 3px;
      background: rgba(255,255,255,0.1); border: none; cursor: pointer;
      position: relative; transition: background 0.2s;
    }
    .billing-toggle__switch.annual { background: rgba(251,191,36,0.3); }
    .billing-toggle__knob {
      display: block; width: 22px; height: 22px; border-radius: 50%;
      background: #fff; transition: transform 0.2s;
    }
    .billing-toggle__switch.annual .billing-toggle__knob { transform: translateX(24px); }
    .billing-toggle__save {
      font-size: 11px; background: rgba(251,191,36,0.15); color: #fbbf24;
      padding: 2px 8px; border-radius: 4px; font-weight: 700;
    }
    .pricing-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: stretch;
    }
    .pricing-card {
      padding: 36px 28px; border-radius: 20px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      position: relative;
      display: flex; flex-direction: column;
    }
    .pricing-card__head { margin-bottom: 20px; }
    .pricing-card__prefix {
      font-size: 12px; color: #9ca3af; margin-top: 4px;
    }
    .pricing-card--featured {
      background: rgba(251,191,36,0.06); border-color: rgba(251,191,36,0.25);
      transform: scale(1.04);
    }
    .pricing-card__cta { margin-top: auto; }
    .pricing-card__badge {
      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #000; font-size: 11px; font-weight: 800; letter-spacing: 1px;
      padding: 4px 16px; border-radius: 20px;
    }
    .pricing-card__name { font-size: 20px; font-weight: 700; color: #fff; display: block; margin-bottom: 16px; }
    .pricing-card__price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 8px; }
    .pricing-card__currency { font-size: 18px; color: #9ca3af; font-weight: 600; }
    .pricing-card__amount { font-size: 48px; font-weight: 900; color: #fff; }
    .pricing-card__period { font-size: 15px; color: #6b7280; }
    .pricing-card__annual-note { font-size: 12px; color: #22c55e; margin-bottom: 16px; }
    .pricing-card__features {
      list-style: none; padding: 0; margin: 0 0 28px;
      display: flex; flex-direction: column; gap: 12px;
      flex-grow: 1;
    }
    .pricing-card__features li {
      font-size: 14px; color: #d1d5db; padding-left: 20px; position: relative;
    }
    .pricing-card__features li::before {
      content: '\\2713'; position: absolute; left: 0; color: #fbbf24; font-weight: 700;
    }

    /* Referral */
    .spark-referral {
      padding: 80px 0;
      background: linear-gradient(180deg, #0a0a12 0%, #0d0b1e 100%);
    }
    .spark-referral__inner { text-align: center; }
    .spark-referral__desc {
      font-size: 16px; color: #9ca3af; max-width: 540px; margin: -32px auto 36px; line-height: 1.7;
    }
    .spark-referral__how {
      display: flex; justify-content: center; gap: 32px; flex-wrap: wrap;
    }
    .spark-referral__step {
      display: flex; align-items: center; gap: 10px; font-size: 14px; color: #d1d5db;
    }
    .spark-referral__step-num {
      width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-size: 13px; font-weight: 800;
      background: rgba(251,191,36,0.15); color: #fbbf24;
    }

    /* CTA Final */
    .spark-cta {
      padding: 100px 0;
      background: linear-gradient(180deg, #0a0a12 0%, #1a0e05 100%);
    }
    .spark-cta__inner { text-align: center; }
    .spark-cta__title {
      font-size: clamp(28px, 4vw, 40px); font-weight: 800; color: #fff; margin-bottom: 16px;
    }
    .spark-cta__desc { font-size: 18px; color: #9ca3af; margin-bottom: 32px; }

    /* Responsive */
    @media (max-width: 768px) {
      .steps-grid { grid-template-columns: 1fr 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .pricing-grid { grid-template-columns: 1fr; }
      .pricing-card--featured { transform: none; }
      .spark-hero { padding: 120px 0 80px; }
      .testimonials-grid { grid-template-columns: 1fr; }
      .demo-box__input-row { flex-direction: column; }
      .proof-grid { gap: 24px; }
    }
    @media (max-width: 480px) {
      .steps-grid { grid-template-columns: 1fr; }
      .spark-referral__how { flex-direction: column; align-items: center; }
    }
  `]
})
export class SparkComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') heroCanvas?: ElementRef<HTMLCanvasElement>;
  private heroScene: { dispose: () => void } | null = null;

  private http = inject(HttpClient);
  private host = inject(ElementRef);
  private seo = inject(SeoService);

  readonly niches = NICHES;

  readonly plans: Plan[] = [
    {
      id: 'starter', name: 'Starter', monthly: 297, featured: false,
      features: [
        '1 perfil (Instagram)',
        '1 post por dia',
        'Imagens com IA',
        'Analytics basico',
        'Templates de nicho',
      ],
      ctaLabel: 'Teste gratis 7 dias', ctaRoute: '/cadastro',
    },
    {
      id: 'pro', name: 'Pro', monthly: 497, featured: true,
      features: [
        '3 redes (IG + FB + LinkedIn)',
        '2 posts por dia',
        'Carrosseis com IA',
        'Analytics completo + Score',
        'A/B Testing de conteudo',
        'Renovacao de tokens',
      ],
      ctaLabel: 'Teste gratis 7 dias', ctaRoute: '/cadastro',
    },
    {
      id: 'enterprise', name: 'Enterprise', monthly: 997, featured: false,
      prefix: 'A partir de',
      features: [
        'Tudo do Pro',
        'Posts ilimitados',
        'Relatorio semanal + mensal',
        'Suporte prioritario',
        'Portal do cliente',
        'Gerente dedicado',
      ],
      ctaLabel: 'Falar com time de vendas', ctaRoute: '/contato',
    },
  ];

  /** Annual = 10x monthly, spread across 12 months. Effective per-month. */
  annualPerMonth(monthly: number): number {
    return Math.round((monthly * 10) / 12);
  }

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.heroCanvas?.nativeElement) return;
    try {
      const { SparkHeroScene } = await import('../three/spark-hero-scene');
      if (this.heroScene === null) {
        this.heroScene = new SparkHeroScene(this.heroCanvas.nativeElement);
      }
    } catch (err) {
      console.error('[SparkComponent] hero scene error', err);
    }
  }

  ngOnDestroy(): void {
    if (this.heroScene) {
      this.heroScene.dispose();
      this.heroScene = null;
    }
  }

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Akroma Spark — Geração de conteúdo com IA para Instagram',
      description:
        'Akroma Spark cria legendas, ideias e roteiros para seu Instagram em segundos. IA treinada para o seu nicho, em português.',
    });

    // SoftwareApplication schema — unlocks rich results (price, rating, category)
    // in Google Search for product queries.
    this.seo.setSchema({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Akroma Spark',
      description:
        'Plataforma de geração de conteúdo com IA para Instagram, treinada em português e especializada por nicho.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://spark.akroma.com.br/',
      inLanguage: 'pt-BR',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '97',
        availability: 'https://schema.org/InStock',
      },
      provider: {
        '@type': 'Organization',
        name: 'Akroma',
        url: 'https://akroma.com.br',
      },
    });
  }

  annual = false;
  demoNiche = 'fitness';
  demoDropdownOpen = false;
  demoLoading = false;
  demoResult: { caption: string; topic: string; niche: string } | null = null;
  demoError: string | null = null;

  expandedNiche: string | null = null;

  get selectedNicheLabel(): string {
    return this.niches.find(n => n.value === this.demoNiche)?.label ?? 'Escolha um nicho';
  }

  get activeNiche(): NicheInfo | null {
    return this.niches.find(n => n.value === this.expandedNiche) ?? null;
  }

  selectNiche(value: string) {
    this.demoNiche = value;
    this.demoDropdownOpen = false;
  }

  toggleNiche(value: string) {
    this.expandedNiche = this.expandedNiche === value ? null : value;
    // Smooth scroll so the expanded detail is visible
    if (this.expandedNiche) {
      setTimeout(() => {
        document.querySelector('.niche-detail')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.demoDropdownOpen && !this.host.nativeElement.contains(event.target as Node)) {
      this.demoDropdownOpen = false;
    }
  }

  generateDemo() {
    this.demoLoading = true;
    this.demoResult = null;
    this.demoError = null;

    this.http.post<any>(`${environment.apiUrl}/api/v1/demo/generate`, {
      niche: this.demoNiche
    }).subscribe({
      next: (res) => {
        this.demoResult = res;
        this.demoLoading = false;
      },
      error: (err) => {
        this.demoError = err.error?.error || 'Falha ao gerar demonstracao. Tente novamente.';
        this.demoLoading = false;
      }
    });
  }
}
