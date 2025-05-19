'use client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, FileText, Image, Share2, CheckCircle, BookOpen } from 'lucide-react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('marketing')
  const [selectedPlatform, setSelectedPlatform] = useState('instagram')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Simulação de pesquisa - em um sistema real, isso chamaria a API do sistema de pesquisa
  const handleSearch = () => {
    setIsSearching(true)
    
    // Simulando um tempo de resposta da API
    setTimeout(() => {
      const mockResults = [
        {
          title: "Engajamento em Redes Sociais: Melhores Práticas para 2025",
          source: "Digital Marketing Institute",
          date: "21 de abril de 2025",
          url: "https://example.com/article1",
          snippet: "Conheça as estratégias comprovadas para aumentar o engajamento nas redes sociais em 2025, com foco em conteúdo autêntico e interativo.",
          credibility_score: 9.2
        },
        {
          title: "Como os Algoritmos das Redes Sociais Mudaram em 2025",
          source: "Social Media Examiner",
          date: "15 de março de 2025",
          url: "https://example.com/article2",
          snippet: "Análise detalhada das mudanças nos algoritmos do Instagram, TikTok e outras plataformas em 2025 e como adaptar sua estratégia.",
          credibility_score: 8.7
        },
        {
          title: "Estudo Revela os Formatos de Conteúdo Mais Eficazes em 2025",
          source: "Journal of Digital Marketing",
          date: "2 de fevereiro de 2025",
          url: "https://example.com/article3",
          snippet: "Pesquisa com 5.000 usuários mostra que vídeos curtos e conteúdo interativo geram 3x mais engajamento que formatos tradicionais.",
          credibility_score: 9.5
        }
      ]
      
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sistema de Pesquisa e Criação de Conteúdo</h1>
          <p className="text-muted-foreground">Encontre fontes confiáveis e crie conteúdo otimizado para suas redes sociais</p>
        </header>
        
        <Tabs defaultValue="pesquisa" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="pesquisa">Pesquisa</TabsTrigger>
            <TabsTrigger value="conteudo">Criação de Conteúdo</TabsTrigger>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Aba de Pesquisa */}
          <TabsContent value="pesquisa">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Pesquisar Fontes</CardTitle>
                  <CardDescription>Encontre informações confiáveis sobre seu tema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-query">Tema da Pesquisa</Label>
                    <Input 
                      id="search-query" 
                      placeholder="Ex: engajamento em redes sociais" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="niche">Nicho</Label>
                    <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                      <SelectTrigger id="niche">
                        <SelectValue placeholder="Selecione um nicho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing Digital</SelectItem>
                        <SelectItem value="moda">Moda</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="financas">Finanças</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plataforma</Label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Selecione uma plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleSearch}
                    disabled={!searchQuery || isSearching}
                  >
                    {isSearching ? "Pesquisando..." : "Pesquisar"}
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Resultados da Pesquisa</CardTitle>
                  <CardDescription>Fontes confiáveis sobre seu tema</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {searchResults.length > 0 ? (
                      <div className="space-y-4">
                        {searchResults.map((result, index) => (
                          <Card key={index} className="border border-muted">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{result.title}</CardTitle>
                                <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                                  {result.credibility_score.toFixed(1)}/10
                                </div>
                              </div>
                              <CardDescription className="flex items-center gap-2">
                                <span>{result.source}</span>
                                <span>•</span>
                                <span>{result.date}</span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <p className="text-sm">{result.snippet}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                              <Button variant="outline" size="sm">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Ver Fonte
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                Usar no Conteúdo
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
                        <p className="text-muted-foreground">
                          Faça uma pesquisa para encontrar fontes confiáveis sobre seu tema
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Aba de Criação de Conteúdo */}
          <TabsContent value="conteudo">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Criar Conteúdo</CardTitle>
                  <CardDescription>Transforme informações em conteúdo para redes sociais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-type">Tipo de Conteúdo</Label>
                    <Select defaultValue="carrossel">
                      <SelectTrigger id="content-type">
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carrossel">Carrossel Educativo</SelectItem>
                        <SelectItem value="reel">Roteiro para Reel/TikTok</SelectItem>
                        <SelectItem value="post">Post com Imagem</SelectItem>
                        <SelectItem value="stories">Sequência de Stories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content-platform">Plataforma</Label>
                    <Select defaultValue="instagram">
                      <SelectTrigger id="content-platform">
                        <SelectValue placeholder="Selecione uma plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content-title">Título do Conteúdo</Label>
                    <Input id="content-title" placeholder="Ex: 5 Dicas para Aumentar Engajamento" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content-sources">Fontes Utilizadas</Label>
                    <div className="bg-muted p-2 rounded-md text-sm">
                      <p className="font-medium">3 fontes selecionadas:</p>
                      <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                        <li>Engajamento em Redes Sociais: Melhores Práticas para 2025</li>
                        <li>Como os Algoritmos das Redes Sociais Mudaram em 2025</li>
                        <li>Estudo Revela os Formatos de Conteúdo Mais Eficazes em 2025</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Gerar Conteúdo
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Editor de Conteúdo</CardTitle>
                  <CardDescription>Edite e finalize seu conteúdo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 h-[500px] flex flex-col items-center justify-center text-center">
                    <Image className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Área de Edição de Conteúdo</h3>
                    <p className="text-muted-foreground mb-4">
                      Aqui você poderá editar textos, adicionar imagens e finalizar seu conteúdo para publicação
                    </p>
                    <Button variant="outline">
                      Gerar um conteúdo primeiro
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Salvar Rascunho
                  </Button>
                  <Button>
                    <Share2 className="h-4 w-4 mr-2" />
                    Exportar Conteúdo
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Aba de Calendário */}
          <TabsContent value="calendario">
            <Card>
              <CardHeader>
                <CardTitle>Calendário Editorial</CardTitle>
                <CardDescription>Planeje e organize seu conteúdo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-8 h-[500px] flex flex-col items-center justify-center text-center">
                  <h3 className="text-lg font-medium mb-2">Calendário Editorial</h3>
                  <p className="text-muted-foreground mb-4">
                    Aqui você poderá visualizar e planejar seu calendário de conteúdo para diferentes plataformas
                  </p>
                  <Button variant="outline">
                    Implementação em Desenvolvimento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba de Analytics */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics de Conteúdo</CardTitle>
                <CardDescription>Acompanhe o desempenho do seu conteúdo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-8 h-[500px] flex flex-col items-center justify-center text-center">
                  <h3 className="text-lg font-medium mb-2">Painel de Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Aqui você poderá visualizar métricas e insights sobre o desempenho do seu conteúdo
                  </p>
                  <Button variant
(Content truncated due to size limit. Use line ranges to read in chunks)