import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateDemoLeadDto } from "./create-demo-lead.dto";
import { TriposService } from "./tripos.service";

@ApiTags("tripos")
@Controller("tripos")
export class TriposController {
  constructor(private readonly triposService: TriposService) {}

  @Get("health")
  health() {
    return this.triposService.health();
  }

  @Get("dashboard")
  dashboard() {
    return this.triposService.dashboard();
  }

  @Get("modules")
  modules() {
    return this.triposService.modules();
  }

  @Get("leads")
  leads() {
    return this.triposService.leads();
  }

  @Get("quotations")
  quotations() {
    return this.triposService.quotations();
  }

  @Get("bookings")
  bookings() {
    return this.triposService.bookings();
  }

  @Get("operations")
  operations() {
    return this.triposService.operations();
  }

  @Get("b2b-agents")
  b2bAgents() {
    return this.triposService.b2bAgents();
  }

  @Get("suppliers")
  suppliers() {
    return this.triposService.suppliers();
  }

  @Get("finance")
  finance() {
    return this.triposService.finance();
  }

  @Post("demo-leads")
  createDemoLead(@Body() dto: CreateDemoLeadDto) {
    return this.triposService.createDemoLead(dto);
  }
}

