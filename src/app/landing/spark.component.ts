import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SeoService } from '../core/services/seo.service';
import { SparkTopbarComponent } from '../shared/components/topbar/topbar.component';
import { SparkFooterComponent } from '../shared/components/footer/footer.component';
import { DEMO_POSTS } from './demo-posts.data';

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

/**
 * Fallback mock posts — used ONLY when demo-posts.data.ts is still empty
 * (i.e. the seed script hasn't been run yet). Once DEMO_POSTS is populated,
 * the real backend-generated posts take over and these are ignored.
 */
interface DemoPost {
  handle: string;          // @username shown in header + caption
  displayName: string;     // brand/person name below handle
  image: string;           // Unsplash URL (free, no-auth CDN)
  caption: string;         // PT-BR caption with @mention prefix
  commentsPool: string[];  // pool of random comments (2 picked each click)
}

const FALLBACK_DEMOS: Record<string, DemoPost> = {
  fitness: {
    handle: 'gympower.oficial',
    displayName: 'GymPower Academia',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80',
    caption: 'Dia de leg — e sim, voce vai sentir amanha.\n\nTres verdades sobre treino de pernas que ninguem te conta:\n\n1. Nao precisa fazer 12 exercicios. Agachamento + leg press + stiff ja matam.\n2. Progredir peso > cansar no aparelho. Anota. Bate a marca da semana passada.\n3. Se nao doeu amanha, voce pegou leve demais.\n\nSua perna vai agradecer em 3 meses. Salva esse post.\n\n#treinodeperna #leg #gym #academia #fitness #treino #workout',
    commentsPool: [
      'Anotado mestre 🔥',
      'Caiu como uma luva, acabei de voltar do leg day 😅',
      'Salvo!',
      'Stiff é o melhor exercicio, concordo',
      'Preciso voltar pra academia',
      'Amanhã não ando kkkk',
      'Conteudo bom demais',
    ],
  },
  tecnologia: {
    handle: 'devpro.br',
    displayName: 'DevPro',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    caption: 'A OpenAI soltou GPT-5. E ninguem percebeu que mudou o jogo.\n\nNao e sobre ser mais rapido. E sobre agentes que executam tarefas de dias em minutos.\n\n3 coisas que ja funcionam HOJE:\n- Code review automatico em PRs\n- Analise de CSV de 500k linhas sem abrir excel\n- Pesquisa de mercado com fontes citadas\n\nQuem nao automatizar em 2026 vai ficar pra tras. Nao e ameaca, e matematica.\n\n#tecnologia #ia #gpt5 #openai #dev #programacao #automacao',
    commentsPool: [
      'Verdade, a gente subestima',
      'Comecei a usar pra code review, game changer',
      'Preciso estudar isso urgente',
      'Salvo pra ler depois 🔖',
      'Conteudo top',
      'Bom demais 👏',
    ],
  },
  gastronomia: {
    handle: 'chefana.cozinha',
    displayName: 'Chef Ana Ribeiro',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80',
    caption: 'Risoto de cogumelos em 25 minutos. Sem mentira.\n\nO segredo que restaurante italiano nao quer que voce saiba: nao precisa ficar mexendo 40 minutos. A cada concha de caldo, mexer 3 vezes e deixar quieto. Ponto.\n\nIngredientes (serve 4):\n- 2 xicaras arroz arborio\n- 300g cogumelos variados\n- 1L caldo de legumes quente\n- 1/2 xicara vinho branco\n- 50g parmesao\n- Manteiga gelada no final (truque!)\n\nSalva pra fazer no fim de semana 🍄\n\n#risoto #receita #gastronomia #cozinha #italiana #chef #foodie',
    commentsPool: [
      'Que delicia 🤤',
      'Vou fazer domingo, obrigada!',
      'Manteiga gelada no final muda tudo mesmo',
      'Salvo! 🔖',
      'Receita top, ja quero provar',
      'A fome que deu agora...',
    ],
  },
  moda: {
    handle: 'lolastyle.br',
    displayName: 'Lola Martins',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    caption: '3 pecas que nunca saem de moda (e todo armario precisa):\n\n1. Camisa branca bem cortada — serve pra trabalho, jantar, viagem\n2. Calca preta reta — 10x mais elegante que skinny\n3. Blazer oversized neutro — eleva qualquer look basico\n\nMinimalismo nao e ter pouco. E ter certo.\n\nSalva esse carrossel pra montar o guarda-roupa do outono 🍂\n\n#moda #estilo #looks #minimalismo #fashion #outfit #styling',
    commentsPool: [
      'Amei as dicas 😍',
      'Blazer oversized é tudo mesmo',
      'Preciso de um blazer assim',
      'Salvo ✨',
      'Conteudo lindo',
      'Cada dia que passa gosto mais do seu feed',
    ],
  },
  juridico: {
    handle: 'dra.patricia.costa',
    displayName: 'Dra. Patricia Costa — OAB/SP',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    caption: 'Voce sabia? Atraso de voo de mais de 4h da direito a indenizacao.\n\nO que a companhia nao te conta:\n\n✅ 4h ou mais = dano moral (media R$ 5.000 a R$ 15.000)\n✅ Bagagem extraviada = restituicao + danos\n✅ Reacomodacao so em classe igual ou superior — nunca inferior\n\nGuarde: cartao de embarque, protocolo da reclamacao e comprovantes de gastos extras.\n\nConteudo informativo. Cada caso deve ser analisado individualmente.\n\n#direito #advogado #consumidor #voo #indenizacao #oab',
    commentsPool: [
      'Nossa, nao sabia disso',
      'Salvei! 🔖',
      'Obrigada pela informacao',
      'Vou acionar a companhia',
      'Conteudo utilissimo',
      'Aconteceu comigo ano passado, perdi o prazo 😭',
    ],
  },
  imobiliario: {
    handle: 'rafael.imoveis',
    displayName: 'Rafael Mendes — Corretor CRECI 54321',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
    caption: 'Comprar ou alugar em 2026? A conta real (sem achismo).\n\nImovel de R$ 500k:\n- Financiamento 30 anos, entrada 20% = parcela ~R$ 4.200/mes\n- Aluguel equivalente = R$ 2.500/mes\n- Diferenca de R$ 1.700 investida no Tesouro Selic = R$ 1.2MM em 30 anos\n\nMoral: comprar nao e sempre a melhor opcao. Depende do seu plano de 10 anos.\n\nChame no direct pra simular o seu caso especifico 📲\n\n#imovel #comprar #alugar #investimento #financiamento #mercadoimobiliario',
    commentsPool: [
      'Conta bem feita 👏',
      'Salvei pra mostrar pra minha esposa',
      'Conteudo raro, a maioria so vende',
      'Quero simular o meu caso',
      'Chamando no direct',
      'Info valiosa, obrigado',
    ],
  },
  educacao: {
    handle: 'profmarcos.estudos',
    displayName: 'Prof. Marcos — Metodo de Estudos',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    caption: 'Tecnica Feynman: como aprender QUALQUER coisa em metade do tempo.\n\n4 passos (cientificamente comprovados):\n\n1. Escolha um topico\n2. Explique como se fosse pra uma crianca de 10 anos\n3. Identifique onde voce travou (= lacuna de conhecimento)\n4. Simplifique ainda mais\n\nSe voce nao consegue explicar simples, voce nao entendeu direito.\n\nFuncao exponencial, calculo integral, macroeconomia — funciona pra tudo.\n\nSalva e aplica hoje 📚\n\n#estudos #aprendizado #feynman #metodo #vestibular #concurso #produtividade',
    commentsPool: [
      'Testei e funciona mesmo',
      'Salvei!',
      'Preciso aplicar urgente, obrigada prof',
      'Conteudo de ouro 🥇',
      'Passei no enem usando isso',
      'Compartilhando com minha turma',
    ],
  },
  saude: {
    handle: 'dra.juliana.saude',
    displayName: 'Dra. Juliana Alves — Nutrologa',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
    caption: '5 sinais de que seu intestino esta pedindo socorro:\n\n1. Cansaco apos refeicoes (nao deveria acontecer)\n2. Gases frequentes / estufamento\n3. Pele com acne ou dermatite sem motivo\n4. Vontade de doce o dia inteiro\n5. Dorme mal mesmo cansado\n\n70% da imunidade esta no intestino. Cuidar dele e cuidar de TUDO: energia, pele, sono, humor.\n\nConteudo educativo. Procure um nutrologo ou gastro pra avaliacao individualizada.\n\n#saude #intestino #nutricao #bemestar #imunidade #medicina #probioticos',
    commentsPool: [
      'Me identifiquei nos 5 😭',
      'Preciso de uma consulta urgente',
      'Conteudo tao importante, obrigada dra',
      'Salvo!',
      'Intestino e tudo mesmo',
      'Vou procurar um profissional',
    ],
  },
};

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

          <!-- Instagram-style post mockup (fixed per niche, random likes/comments) -->
          <div class="ig-post" *ngIf="demoPost" [class.ig-post--loading]="demoLoading">
            <header class="ig-post__head">
              <div class="ig-post__avatar">
                <span>{{ demoPost.handle.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="ig-post__who">
                <span class="ig-post__handle">{{ demoPost.handle }}</span>
                <span class="ig-post__name">{{ demoPost.displayName }}</span>
              </div>
              <svg class="ig-post__more" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>
              </svg>
            </header>

            <img class="ig-post__image" [src]="demoPost.image" alt="" loading="lazy">

            <div class="ig-post__actions">
              <div class="ig-post__actions-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </div>
              <svg class="ig-post__save" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            </div>

            <div class="ig-post__likes">
              Curtido por <strong>{{ demoPost.firstLiker }}</strong> e outras <strong>{{ demoPost.likes | number:'1.0-0':'pt-BR' }} pessoas</strong>
            </div>

            <p class="ig-post__caption">
              <strong>{{ demoPost.handle }}</strong>
              <span class="ig-post__caption-text">{{ demoPost.caption }}</span>
            </p>

            <div class="ig-post__comments">
              <div class="ig-post__comment" *ngFor="let c of demoPost.comments">
                <strong>{{ c.handle }}</strong> {{ c.text }}
              </div>
              <div class="ig-post__all-comments">Ver todos os {{ demoPost.commentCount }} comentarios</div>
            </div>

            <div class="ig-post__time">HA {{ demoPost.hoursAgo }} HORAS</div>
          </div>

          <div class="ig-post-empty" *ngIf="!demoPost && !demoLoading">
            Clique em <strong>Gerar post de exemplo</strong> pra ver como ficaria um post seu.
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
    <section id="solucoes" class="spark-niches spark-section-target">
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
          <a routerLink="/cadastro" [queryParams]="{ niche: activeNiche.value }" class="btn btn--spark btn--full">
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
        <p class="spark-cta__desc">Trial Starter de 7 dias gratis. Sem cartao. Sem compromisso.</p>
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
      position: relative; padding: 96px 0 48px; overflow: hidden;
      min-height: calc(100vh - 72px);
      background: linear-gradient(180deg, #080c1a 0%, #0a0a12 50%, #0a0a12 100%);
      display: flex; align-items: center;
    }
    @media (max-width: 768px) {
      .spark-hero { padding: 88px 0 40px; min-height: auto; }
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
    .spark-hero__label { margin-bottom: 14px; }
    .spark-hero__title {
      font-size: clamp(32px, 4.2vw, 54px); font-weight: 900; color: #fff;
      line-height: 1.08; margin-bottom: 18px;
    }
    .spark-hero__title--accent {
      background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .spark-hero__subtitle {
      font-size: 17px; color: #9ca3af; line-height: 1.6; margin-bottom: 24px;
      max-width: 520px;
    }
    .spark-hero__ctas { display: flex; gap: 16px; flex-wrap: wrap; }
    @media (max-width: 768px) {
      .spark-hero__subtitle { margin-left: auto; margin-right: auto; }
      .spark-hero__ctas { justify-content: center; }
    }
    .spark-hero__trial-note {
      margin-top: 12px; font-size: 12px; color: #6b7280;
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
    .btn--full { width: 100%; box-sizing: border-box; }
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
    .demo-box__input-row { display: flex; gap: 12px; margin-bottom: 20px; position: relative; align-items: stretch; }

    /* Custom dropdown — dark theme, no native select quirks */
    .demo-dropdown { flex: 1; position: relative; }
    .demo-dropdown__trigger {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; border-radius: 10px; font-size: 15px; font-weight: 500;
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

    /* ── Instagram post mockup ───────────────────────────────────────────── */
    .ig-post-empty {
      margin-top: 20px; padding: 28px; border-radius: 14px;
      background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.08);
      color: #6b7280; text-align: center; font-size: 14px;
    }
    .ig-post-empty strong { color: #fbbf24; font-weight: 600; }
    .ig-post {
      margin: 20px auto 0; max-width: 480px;
      background: #ffffff; color: #262626;
      border-radius: 12px; overflow: hidden;
      border: 1px solid #dbdbdb;
      box-shadow: 0 12px 40px -12px rgba(0,0,0,0.6);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      transition: opacity 0.2s;
    }
    .ig-post--loading { opacity: 0.5; }
    .ig-post__head {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px;
    }
    .ig-post__avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 14px;
      padding: 2px;
    }
    .ig-post__avatar span {
      width: 100%; height: 100%; border-radius: 50%;
      background: #fff; color: #262626;
      display: flex; align-items: center; justify-content: center;
    }
    .ig-post__who { flex: 1; display: flex; flex-direction: column; line-height: 1.2; }
    .ig-post__handle { font-size: 14px; font-weight: 600; color: #262626; }
    .ig-post__name { font-size: 12px; color: #8e8e8e; }
    .ig-post__more { width: 20px; height: 20px; color: #262626; cursor: pointer; }
    .ig-post__image {
      display: block; width: 100%; aspect-ratio: 4 / 5;
      object-fit: contain; background: #efefef;
    }
    .ig-post__actions {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 14px 4px;
    }
    .ig-post__actions svg { width: 24px; height: 24px; color: #262626; cursor: pointer; }
    .ig-post__actions-left { display: flex; gap: 14px; }
    .ig-post__likes {
      padding: 4px 14px; font-size: 14px; color: #262626;
    }
    .ig-post__likes strong { font-weight: 600; }
    .ig-post__caption {
      padding: 4px 14px; font-size: 14px; color: #262626; line-height: 1.4;
      margin: 0; white-space: pre-line;
    }
    .ig-post__caption strong { font-weight: 600; margin-right: 6px; }
    .ig-post__caption-text { color: #262626; }
    .ig-post__comments { padding: 6px 14px 4px; }
    .ig-post__comment { font-size: 14px; color: #262626; line-height: 1.4; margin-bottom: 2px; }
    .ig-post__comment strong { font-weight: 600; margin-right: 6px; }
    .ig-post__all-comments {
      font-size: 14px; color: #8e8e8e; margin: 4px 0; cursor: pointer;
    }
    .ig-post__time {
      padding: 6px 14px 14px;
      font-size: 10px; color: #8e8e8e; letter-spacing: 0.2px;
      text-transform: uppercase;
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
      font-size: 40px; font-weight: 900; display: block; margin-bottom: 16px;
      color: #fbbf24;
      text-shadow:
        0 0 8px rgba(251,191,36,0.55),
        0 0 20px rgba(251,191,36,0.35),
        0 0 40px rgba(245,158,11,0.25);
      letter-spacing: 0.02em;
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
      background: rgba(251,191,36,0.06);
      border-color: rgba(251,191,36,0.45);
      box-shadow: 0 12px 40px -12px rgba(251,191,36,0.25);
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

  plans: Plan[] = [
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

  private readonly apiUrl = environment.apiUrl;

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

    // Fetch admin-controlled prices and override defaults (SSR-safe: only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<{ starter: { monthly: string }; pro: { monthly: string } }>(
        `${this.apiUrl}/api/v1/plans/spark`
      ).subscribe({
        next: (prices) => {
          const starterIdx = this.plans.findIndex(p => p.id === 'starter');
          const proIdx     = this.plans.findIndex(p => p.id === 'pro');
          if (starterIdx >= 0) {
            this.plans[starterIdx] = { ...this.plans[starterIdx], monthly: +prices.starter.monthly };
          }
          if (proIdx >= 0) {
            this.plans[proIdx] = { ...this.plans[proIdx], monthly: +prices.pro.monthly };
          }
        },
        error: () => {} // Keep hardcoded defaults on any error
      });
    }
  }

  annual = false;
  demoNiche = 'fitness';
  demoDropdownOpen = false;
  demoLoading = false;

  /** Rendered Instagram mockup. Fixed image/caption per niche; likes & comments randomized. */
  demoPost: {
    handle: string;
    displayName: string;
    image: string;
    caption: string;
    likes: number;
    firstLiker: string;
    comments: { handle: string; text: string }[];
    commentCount: number;
    hoursAgo: number;
  } | null = null;

  /** Pool of handles used as "first liker" + random commenters. */
  private readonly LIKER_POOL = [
    'andreey.dev', 'mariana.souza', 'joao_costa', 'lu.fernandes',
    'pedrohenrique', 'bea.alves', 'carolinasilva', 'tiago.mr',
    'rafaela.ok', 'leo.m', 'ana.paula_', 'gabizinha.bc',
  ];

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

  /** Pick N unique random items from a pool. */
  private pickRandom<T>(pool: T[], n: number): T[] {
    const copy = [...pool];
    const out: T[] = [];
    for (let i = 0; i < n && copy.length; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    return out;
  }

  /** Random integer in [min, max] inclusive. */
  private randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Build the mock Instagram post. Image + caption are fixed per niche;
   * likes, first liker, comments and "hours ago" are randomized each click
   * to feel alive without making any API calls.
   *
   * Priority: DEMO_POSTS (real backend-generated posts from seed script)
   * falls back to FALLBACK_DEMOS (Unsplash stock + hand-written captions)
   * when the seed script hasn't been run yet.
   */
  generateDemo() {
    const real = DEMO_POSTS.find(p => p.niche === this.demoNiche);
    const fallback = FALLBACK_DEMOS[this.demoNiche];

    const data: DemoPost | null = real
      ? {
          handle: real.handle,
          displayName: real.displayName,
          image: real.image,
          caption: real.caption,
          commentsPool: (fallback?.commentsPool ?? [
            'Salvei!', 'Conteudo top 👏', 'Muito bom', 'Top demais',
            'Otimo ponto', 'Concordo 100%', 'Preciso pensar nisso',
          ]),
        }
      : (fallback ?? null);

    if (!data) return;

    this.demoLoading = true;
    // Brief loading state (~400ms) so the button feels responsive.
    setTimeout(() => {
      const likers = this.pickRandom(this.LIKER_POOL, 3);
      const commentTexts = this.pickRandom(data.commentsPool, 2);
      const commenters = this.pickRandom(
        this.LIKER_POOL.filter(h => !likers.includes(h)),
        2,
      );

      this.demoPost = {
        handle: data.handle,
        displayName: data.displayName,
        image: data.image,
        caption: data.caption,
        likes: this.randInt(1240, 9870),
        firstLiker: likers[0],
        comments: commenters.map((h, i) => ({ handle: h, text: commentTexts[i] })),
        commentCount: this.randInt(42, 318),
        hoursAgo: this.randInt(2, 22),
      };
      this.demoLoading = false;
    }, 400);
  }
}
